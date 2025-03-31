import express, { Request, Response, Router } from "express";
import Employee, { IEmployee } from "../models/Employee";
import { Types } from "mongoose"; // Import Types từ mongoose

const router: Router = express.Router();

// Tạo nhân viên mới
// @ts-ignore
router.post("/", async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ error: "Email already exists" });
        }
        // const newEmployee = new Employee({ name, dateOfBirth, gender, email, address });
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.status(201).json({ message: "Employee created successfully", employee: newEmployee });
    } catch (error) {
        res.status(500).json({ error: "Error creating employee" });
    }
});

// Lấy danh sách nhân viên
router.get("/", async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1; // Default page = 1
        const limit = parseInt(req.query.limit as string) || 10; // Default limit = 10
        const skip = (page - 1) * limit; // Calculate how many records to skip
        const totalEmployees = await Employee.countDocuments(); // Get total number of employees
        const employees = await Employee.find().skip(skip).limit(limit); // Fetch paginated employees

        res.json({
            total: totalEmployees,
            page,
            limit,
            totalPages: Math.ceil(totalEmployees / limit),
            data: employees,
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching employees" });
    }
});

// Lấy thông tin nhân viên theo ID
// @ts-ignore
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ error: "Employee not found" });

        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: "Error fetching employee" });
    }
});


// Cập nhật thông tin nhân viên
// @ts-ignore
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const { name, dateOfBirth, gender, email, address } = req.body;

        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            { name, dateOfBirth, gender, email, address },
            { new: true }
        );

        if (!updatedEmployee) return res.status(404).json({ error: "Employee not found" });

        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ error: "Error updating employee" });
    }
});

// Xóa nhân viên
// @ts-ignore
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) return res.status(404).json({ error: "Employee not found" });

        res.json({ message: "Employee deleted successfully", _id: req.params.id });
    } catch (error) {
        res.status(500).json({ error: "Error deleting employee" });
    }
});

export default router;
