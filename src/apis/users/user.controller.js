import UserService from './user.service.js';
class UserController {
    getAllUser = async (req, res, next) => {
        try {
            const { page, size, username } = req.query;
            if (page && page > 0) {
                const users = await UserService.getUserWithPaging(page, size, username);
                return res.status(200).json(users);
            } else {
                const users = await UserService.getAll(username);
                return res.status(200).json(users);
            }
        } catch (error) {
            next(error);
        }

    }

    getUserById = async (req, res, next) => {
        const user = await UserService.getById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'User does not exist.' });
        }
        return res.status(200).json(user);
    }

    createNewUser = async (req, res, next) => {
        let newUser = {
            fullname: req.body.fullname,
            gender: req.body.gender,
            age: req.body.age,
            password: req.body.password,
            createdBy: req.session.id
        };
        await UserService.create(newUser);
        return res.status(201).json(newUser);
    }

    updateUser = async (req, res, next) => {
        let user = await UserService.getById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'User does not exist.' });
        }

        user = {
            ...user,
            fullname: req.body.fullname,
            gender: req.body.gender,
            age: req.body.age,
            password: req.body.password
        };

        try {
            await UserService.update(req.params.id, user);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(204).json();
    }

    removeUser = async (req, res, next) => {
        const user = await UserService.getById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'User does not exist.' });
        }

        try {
            await UserService.removeById(req.params.id);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
        return res.status(204).json();
    }
}

export default new UserController();