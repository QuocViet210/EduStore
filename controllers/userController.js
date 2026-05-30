const User = require('../models/User');
const Order = require('../models/Order');
const { sendSuccess, sendError, getPagination } = require('../utils/responseHandler');
const crypto = require('crypto');

/**
 * Hàm hash password
 */
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

/**
 * ✅ READ: Lấy danh sách người dùng - Admin API
 * GET /api/users
 */
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role = '', search = '' } = req.query;
        const { skip } = getPagination(page, limit);

        let filter = {};

        if (role) {
            filter.role = role;  // 'user' hoặc 'admin'
        }

        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
            .select('-password');  // Không trả về password

        const total = await User.countDocuments(filter);

        sendSuccess(res, {
            users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total
            }
        }, 'Lấy danh sách người dùng thành công');

    } catch (error) {
        console.error('❌ Error in getAllUsers:', error);
        sendError(res, 'Lỗi khi lấy danh sách người dùng', 500);
    }
};

/**
 * ✅ READ: Lấy chi tiết người dùng
 * GET /api/users/:id
 */
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return sendError(res, 'Người dùng không tồn tại', 404);
        }

        sendSuccess(res, user, 'Lấy thông tin người dùng thành công');

    } catch (error) {
        console.error('❌ Error in getUserById:', error);
        sendError(res, 'Lỗi khi lấy thông tin người dùng', 500);
    }
};

/**
 * ✅ READ: Lấy thông tin người dùng hiện tại
 * GET /api/users/profile/me
 */
exports.getCurrentUser = async (req, res) => {
    try {
        if (!req.session.user) {
            return sendError(res, 'Chưa đăng nhập', 401);
        }

        const user = await User.findById(req.session.user._id).select('-password');

        sendSuccess(res, user, 'Lấy thông tin cá nhân thành công');

    } catch (error) {
        console.error('❌ Error in getCurrentUser:', error);
        sendError(res, 'Lỗi khi lấy thông tin cá nhân', 500);
    }
};

/**
 * ✅ UPDATE: Cập nhật thông tin người dùng
 * PUT /api/users/:id
 */
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, phone, address } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return sendError(res, 'Người dùng không tồn tại', 404);
        }

        // Kiểm tra email trùng (ngoại trừ email hiện tại)
        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return sendError(res, 'Email này đã được sử dụng', 400);
            }
        }

        // Kiểm tra username trùng (ngoại trừ username hiện tại)
        if (username && username !== user.username) {
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return sendError(res, 'Username này đã được sử dụng', 400);
            }
        }

        // Cập nhật thông tin
        if (username) user.username = username.trim();
        if (email) user.email = email.toLowerCase().trim();
        if (phone) user.phone = phone.trim();
        if (address) user.address = address.trim();

        await user.save();

        const updatedUser = await User.findById(id).select('-password');

        console.log(`✅ Cập nhật người dùng: ${updatedUser.username}`);
        sendSuccess(res, updatedUser, 'Cập nhật thông tin thành công');

    } catch (error) {
        console.error('❌ Error in updateUser:', error);
        sendError(res, 'Lỗi khi cập nhật thông tin người dùng', 500);
    }
};

/**
 * ✅ UPDATE: Đổi mật khẩu
 * PUT /api/users/:id/change-password
 */
exports.changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        // Kiểm tra dữ liệu
        if (!oldPassword || !newPassword || !confirmPassword) {
            return sendError(res, 'Vui lòng nhập đầy đủ thông tin', 400);
        }

        if (newPassword !== confirmPassword) {
            return sendError(res, 'Mật khẩu mới và xác nhận không khớp', 400);
        }

        if (newPassword.length < 6) {
            return sendError(res, 'Mật khẩu mới phải ít nhất 6 ký tự', 400);
        }

        // Tìm user
        const user = await User.findById(id);
        if (!user) {
            return sendError(res, 'Người dùng không tồn tại', 404);
        }

        // Kiểm tra mật khẩu cũ
        const oldPasswordHash = hashPassword(oldPassword);
        if (user.password !== oldPasswordHash) {
            return sendError(res, 'Mật khẩu cũ không chính xác', 400);
        }

        // Cập nhật mật khẩu mới
        user.password = hashPassword(newPassword);
        await user.save();

        console.log(`✅ Đổi mật khẩu: ${user.username}`);
        sendSuccess(res, null, 'Đổi mật khẩu thành công');

    } catch (error) {
        console.error('❌ Error in changePassword:', error);
        sendError(res, 'Lỗi khi đổi mật khẩu', 500);
    }
};

/**
 * ✅ DELETE: Xóa người dùng - Admin API (Soft delete)
 * DELETE /api/users/:id
 */
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Không cho phép xóa chính mình
        if (req.session.user._id === id) {
            return sendError(res, 'Không thể xóa chính mình', 400);
        }

        const user = await User.findById(id);
        if (!user) {
            return sendError(res, 'Người dùng không tồn tại', 404);
        }

        // Soft delete
        user.isActive = false;
        await user.save();

        console.log(`✅ Xóa người dùng (ẩn): ${user.username}`);
        sendSuccess(res, user, 'Xóa người dùng thành công');

    } catch (error) {
        console.error('❌ Error in deleteUser:', error);
        sendError(res, 'Lỗi khi xóa người dùng', 500);
    }
};

/**
 * ✅ RESTORE: Khôi phục người dùng bị xóa
 * PATCH /api/users/:id/restore
 */
exports.restoreUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return sendError(res, 'Người dùng không tồn tại', 404);
        }

        user.isActive = true;
        await user.save();

        console.log(`✅ Khôi phục người dùng: ${user.username}`);
        sendSuccess(res, user, 'Khôi phục người dùng thành công');

    } catch (error) {
        console.error('❌ Error in restoreUser:', error);
        sendError(res, 'Lỗi khi khôi phục người dùng', 500);
    }
};

/**
 * 🔒 AUTHENTICATION: Đăng ký tài khoản mới
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // 1️⃣ Kiểm tra dữ liệu
        if (!username || !email || !password || !confirmPassword) {
            return sendError(res, 'Vui lòng nhập đầy đủ thông tin', 400);
        }

        if (password !== confirmPassword) {
            return sendError(res, 'Mật khẩu không khớp', 400);
        }

        if (password.length < 6) {
            return sendError(res, 'Mật khẩu phải ít nhất 6 ký tự', 400);
        }

        // 2️⃣ Kiểm tra email/username trùng
        const existingEmail = await User.findOne({ email: email.toLowerCase() });
        if (existingEmail) {
            return sendError(res, 'Email này đã được đăng ký', 400);
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return sendError(res, 'Username này đã được sử dụng', 400);
        }

        // 3️⃣ Tạo user mới
        const newUser = new User({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: password,
            role: 'user'
        });

        await newUser.save();

        // 4️⃣ Tạo session
        req.session.user = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        };

        const userResponse = await User.findById(newUser._id).select('-password');

        console.log(`✅ Đăng ký thành công: ${newUser.username}`);
        sendSuccess(res, userResponse, 'Đăng ký thành công', 201);

    } catch (error) {
        console.error('❌ Error in register:', error);
        sendError(res, error.message || 'Lỗi khi đăng ký', 500);
    }
};

/**
 * 🔒 AUTHENTICATION: Đăng nhập
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1️⃣ Kiểm tra dữ liệu
        if (!email || !password) {
            return sendError(res, 'Vui lòng nhập email và mật khẩu', 400);
        }

        // 2️⃣ Tìm user theo email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return sendError(res, 'Email hoặc mật khẩu không chính xác', 400);
        }

        // 3️⃣ Kiểm tra mật khẩu
        const passwordHash = hashPassword(password);
        if (user.password !== passwordHash) {
            return sendError(res, 'Email hoặc mật khẩu không chính xác', 400);
        }

        // 4️⃣ Kiểm tra tài khoản có active không
        if (!user.isActive) {
            return sendError(res, 'Tài khoản này đã bị vô hiệu hóa', 403);
        }

        // 5️⃣ Tạo session
        req.session.user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        const userResponse = await User.findById(user._id).select('-password');

        console.log(`✅ Đăng nhập thành công: ${user.username}`);
        sendSuccess(res, userResponse, 'Đăng nhập thành công');

    } catch (error) {
        console.error('❌ Error in login:', error);
        sendError(res, 'Lỗi khi đăng nhập', 500);
    }
};

/**
 * 🔒 AUTHENTICATION: Đăng xuất
 * POST /api/auth/logout
 */
/**
 * Đăng xuất tài khoản
 */
exports.logout = (req, res) => {
    try {
        // Hủy session của người dùng hiện tại
        req.session.destroy((err) => {
            if (err) {
                console.error(' Lỗi khi đăng xuất:', err);
                return res.status(500).send('Lỗi khi đăng xuất');
            }

            // Tùy chọn: Xóa luôn cookie lưu session trên trình duyệt cho sạch sẽ
            res.clearCookie('connect.sid');

            // Lệnh quan trọng nhất: Chuyển hướng người dùng về Trang chủ (hoặc '/login')
            res.redirect('/');
        });
    } catch (error) {
        console.error(' Lỗi hệ thống:', error);
        res.redirect('/');
    }
};

/**
 *  RENDER: Trang đăng nhập
 */
exports.getLoginPage = (req, res) => {
    console.log(' getLoginPage called');
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('login', { error: '' });
};

/**
 *  RENDER: Trang đăng ký
 */
exports.getRegisterPage = (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('register', { error: '' });
};

/**
 *  RENDER: Trang hồ sơ cá nhân
 */
exports.getProfilePage = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const user = await User.findById(req.session.user._id).select('-password');
        res.render('profile', { user });
    } catch (error) {
        console.error(' Error in getProfilePage:', error);
        res.status(500).send('Lỗi Server!');
    }
};

/**
 *  RENDER: Trang đổi mật khẩu
 */
exports.getChangePasswordPage = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('change-password', { error: '' });
};

/**
 * 🔒 RENDER/API: Người dùng tự cập nhật thông tin cá nhân của mình
 * PUT /api/users/profile/update
 */
exports.updateMyProfile = async (req, res) => {
    try {
        // Lấy ID người dùng từ Session đã đăng nhập
        const userId = req.session.user._id;
        const { username, phone, address } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
        }

        // Kiểm tra xem username có bị trùng với người khác không
        if (username && username !== user.username) {
            const existingUsername = await User.findOne({ username: username.trim() });
            if (existingUsername) {
                return res.status(400).json({ success: false, message: 'Tên hiển thị này đã có người sử dụng' });
            }
            user.username = username.trim();
        }

        // Cập nhật SĐT và Địa chỉ
        if (phone !== undefined) user.phone = phone.trim();
        if (address !== undefined) user.address = address.trim();

        // Lưu vào DB
        await user.save();

        // Quan trọng: Cập nhật lại cái tên trong Session để Header hiển thị đúng tên mới
        req.session.user.username = user.username;

        res.json({ success: true, message: 'Cập nhật thông tin thành công', user });

    } catch (error) {
        console.error('❌ Error in updateMyProfile:', error);
        res.status(500).json({ success: false, message: 'Lỗi server khi lưu thông tin' });
    }
};

exports.getMyOrdersPage = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/api/auth/login');
        }

        // Lấy đơn hàng dựa vào trường "userId" trong Schema của em
        const orders = await Order.find({ userId: req.session.user._id }).sort({ createdAt: -1 });

        res.render('my-orders', {
            user: req.session.user,
            orders: orders
        });

    } catch (error) {
        console.error('❌ Lỗi khi lấy danh sách đơn hàng cá nhân:', error);
        res.status(500).send('Lỗi máy chủ khi tải đơn hàng!');
    }
};