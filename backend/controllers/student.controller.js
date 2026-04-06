import Student from "../models/student.model.js";
import Class from "../models/class.model.js";
import { errorHandler } from "../utils/error.js";

// CREATE STUDENT
export const createStudent = async (req, res) => {
  try {
    const { name, gender, dob, email, feesPaid, class: className } = req.body;

    // Validation
    if (!name || !gender || !dob || !email || !feesPaid || !className) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find class by its name
    const classData = await Class.findOne({ name: className });
    if (!classData) {
      return res.status(400).json({
        success: false,
        message: `Invalid class name: ${className}. Please create this class first.`,
      });
    }

    // Create new student and link to class
    const newStudent = await Student.create({
      name,
      gender,
      dob,
      email,
      feesPaid,
      class: classData._id,
    });

    // Update class with new student
    await Class.findByIdAndUpdate(classData._id, {
      $push: { students: newStudent._id },
      $inc: { currentCapacity: 1 },
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student: newStudent,
    });
  } catch (error) {
    console.error("❌ Error creating student:", error);
    res.status(500).json({
      success: false,
      message: "Error creating student",
      error: error.message,
    });
  }
};

// UPDATE STUDENT
export const updateStudent = async (req, res, next) => {
  try {
    const existing = await Student.findById(req.params.id);
    if (!existing) return next(errorHandler(404, "Student not found!"));

    const prevClass = existing.class ? existing.class.toString() : null;
    const prevGender = existing.gender;

    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // If class changed
    if (req.body.class && req.body.class !== prevClass) {
      if (prevClass) {
        const oldClass = await Class.findById(prevClass);
        if (oldClass) {
          oldClass.students = oldClass.students.filter(
            (id) => id.toString() !== req.params.id
          );
          oldClass.currentCapacity = Math.max(
            0,
            (oldClass.currentCapacity || 1) - 1
          );
          if (prevGender === "Male")
            oldClass.numMaleStudents = Math.max(
              0,
              (oldClass.numMaleStudents || 1) - 1
            );
          if (prevGender === "Female")
            oldClass.numFemaleStudents = Math.max(
              0,
              (oldClass.numFemaleStudents || 1) - 1
            );
          await oldClass.save();
        }
      }

      const newClass = await Class.findById(req.body.class);
      if (newClass) {
        newClass.students.push(updated._id);
        newClass.currentCapacity = (newClass.currentCapacity || 0) + 1;
        if (updated.gender === "Male")
          newClass.numMaleStudents = (newClass.numMaleStudents || 0) + 1;
        if (updated.gender === "Female")
          newClass.numFemaleStudents = (newClass.numFemaleStudents || 0) + 1;
        await newClass.save();
      }
    } else if (req.body.gender && req.body.gender !== prevGender) {
      if (updated.class) {
        const classDoc = await Class.findById(updated.class);
        if (classDoc) {
          if (prevGender === "Male")
            classDoc.numMaleStudents = Math.max(
              0,
              (classDoc.numMaleStudents || 1) - 1
            );
          if (prevGender === "Female")
            classDoc.numFemaleStudents = Math.max(
              0,
              (classDoc.numFemaleStudents || 1) - 1
            );
          if (updated.gender === "Male")
            classDoc.numMaleStudents = (classDoc.numMaleStudents || 0) + 1;
          if (updated.gender === "Female")
            classDoc.numFemaleStudents = (classDoc.numFemaleStudents || 0) + 1;
          await classDoc.save();
        }
      }
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE STUDENT
export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const classId = student.class;
    await Student.findByIdAndDelete(req.params.id);

    if (classId) {
      const classDoc = await Class.findById(classId);
      if (classDoc) {
        classDoc.students = classDoc.students.filter(
          (sId) => sId.toString() !== req.params.id
        );
        classDoc.currentCapacity = Math.max(
          0,
          (classDoc.currentCapacity || 1) - 1
        );
        if (student.gender === "Male")
          classDoc.numMaleStudents = Math.max(
            0,
            (classDoc.numMaleStudents || 1) - 1
          );
        if (student.gender === "Female")
          classDoc.numFemaleStudents = Math.max(
            0,
            (classDoc.numFemaleStudents || 1) - 1
          );
        await classDoc.save();
      }
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE STUDENT
export const getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate("class");
    if (!student) return next(errorHandler(404, "Student not found!"));
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

// GET ALL STUDENTS
export const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find().populate("class");
    res.status(200).json(students);
  } catch (error) {
    next(error);
  }
};

// GET STUDENT ID BY NAME
export const getIdByName = async (req, res, next) => {
  try {
    const studentName = req.params.name.trim();
    const studentData = await Student.findOne({ name: studentName });
    if (!studentData)
      return res.status(404).json({ message: "Student not found" });
    res.status(200).json(studentData._id);
  } catch (error) {
    next(error);
  }
};

// GET FORM SCHEMA
export const getStudentForm = async (req, res, next) => {
  try {
    const formSchema = {
      name: "",
      email: "",
      gender: "",
      dob: "",
      feesPaid: "",
      class: "",
    };
    res.status(200).json([formSchema]);
  } catch (error) {
    next(error);
  }
};

// GET TOTAL FEES SUM
export const getStudentFeesSum = async (req, res, next) => {
  try {
    const result = await Student.aggregate([
      { $group: { _id: null, sum: { $sum: "$feesPaid" } } },
    ]);
    res.status(200).json({ sum: result[0]?.sum || 0 });
  } catch (error) {
    next(error);
  }
};
