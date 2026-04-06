import Teacher from "../models/teacher.model.js";
import Class from "../models/class.model.js";
import { errorHandler } from "../utils/error.js";

// ---------------- CREATE TEACHER ----------------
export const createTeacher = async (req, res, next) => {
  try {
    const className = req.body.assignedClass?.trim();

    const foundClass = await Class.findOne({ name: className });
    if (!foundClass)
      return res.status(404).json({ message: "Class not found" });

    const newTeacher = await Teacher.create({
      ...req.body,
      assignedClass: foundClass._id,
    });

    foundClass.teacher = newTeacher._id;
    await foundClass.save();

    res.status(201).json(newTeacher);
  } catch (error) {
    next(error);
  }
};

// ---------------- DELETE TEACHER ----------------
export const deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    await Teacher.findByIdAndDelete(req.params.id);

    const foundClass = await Class.findOne({ teacher: req.params.id });
    if (foundClass) {
      foundClass.teacher = null;
      await foundClass.save();
    }

    res.status(200).json({ message: "Teacher has been deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ---------------- UPDATE TEACHER ----------------
export const updateTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return next(errorHandler(404, "Teacher not found!"));

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedTeacher);
  } catch (error) {
    next(error);
  }
};

// ---------------- GET SINGLE TEACHER ----------------
export const getTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate(
      "assignedClass"
    );
    if (!teacher) return next(errorHandler(404, "Teacher not found!"));
    res.status(200).json(teacher);
  } catch (error) {
    next(error);
  }
};

// ---------------- GET ALL TEACHERS ----------------
export const getTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find().populate("assignedClass");
    res.status(200).json(teachers);
  } catch (error) {
    next(error);
  }
};

// ---------------- GET TEACHER ID BY NAME ----------------
export const getIdByName = async (req, res, next) => {
  try {
    const teacherName = req.params.name.trim();
    const teacherData = await Teacher.findOne({ name: teacherName });
    if (!teacherData)
      return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json(teacherData._id);
  } catch (error) {
    next(error);
  }
};

// ---------------- GET TEACHER FORM DATA ----------------
export const getTeachersForm = async (req, res, next) => {
  try {
    const teachers = await Teacher.find(
      {},
      { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, role: 0 }
    );
    res.status(200).json(teachers);
  } catch (error) {
    next(error);
  }
};

// ---------------- GET TOTAL SALARY ----------------
export const getTeacherSalariesSum = async (req, res, next) => {
  try {
    const result = await Teacher.aggregate([
      { $group: { _id: null, sum: { $sum: "$salary" } } },
    ]);
    res.status(200).json({ sum: result[0]?.sum || 0 });
  } catch (error) {
    next(error);
  }
};
