import Class from "../models/class.model.js";
import { errorHandler } from "../utils/error.js";
import Student from "../models/student.model.js";

export const createClass = async (req, res, next) => {
  try {
    const { name, year, maxCapacity, teacher } = req.body;

    // Basic validation
    if (!name || !year || !maxCapacity) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, year, and maxCapacity.",
      });
    }

    // If teacher is provided, check if exists
    let teacherRef = null;
    if (teacher) {
      const teacherExists = await Teacher.findById(teacher);
      if (!teacherExists) {
        return res.status(404).json({
          success: false,
          message: "Teacher not found.",
        });
      }
      teacherRef = teacherExists._id;
    }

    // Create new class
    const newClass = new Class({
      name: name.trim(),
      year,
      maxCapacity,
      teacher: teacherRef,
    });

    const savedClass = await newClass.save();

    res.status(201).json({
      success: true,
      message: "Class created successfully!",
      class: savedClass,
    });
  } catch (error) {
    console.error("❌ Error creating class:", error);
    next(error);
  }
};

export const getClassesDropdown = async (req, res) => {
  try {
    const classes = await Class.find({}, { _id: 1, name: 1 });
    res.status(200).json(classes);
  } catch (error) {
    console.error("❌ Error fetching dropdown classes:", error);
    res.status(500).json({ message: "Failed to fetch classes" });
  }
};

export const deleteClass = async (req, res, next) => {
  const classData = await Class.findById(req.params.id);

  if (!classData) {
    return next(errorHandler(404, "Class not found!"));
  }
  try {
    // Find all students associated with the class
    const studentsToUpdate = await Student.find({ class: req.params.id });

    // Update class field for each student to null
    await Promise.all(
      studentsToUpdate.map(async (student) => {
        student.class = null;
        await student.save();
      })
    );

    // Delete the class
    await Class.findByIdAndDelete(req.params.id);

    res.status(200).json("Class has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateClass = async (req, res, next) => {
  const existingclass = await Class.findById(req.params.id);
  if (!existingclass) {
    return next(errorHandler(404, "Class not found!"));
  }
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedClass);
  } catch (error) {
    next(error);
  }
};

export const getClass = async (req, res, next) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate("students")
      .populate("teacher");
    if (!classData) {
      return next(errorHandler(404, "Class not found!"));
    }
    res.status(200).json(classData);
  } catch (error) {
    next(error);
  }
};

export const getClassByName = async (req, res, next) => {
  try {
    const className = req.params.name;

    const classData = await Class.findOne({ name: className })
      .populate("students")
      .populate("teacher");

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    const numMaleStudents = await Student.countDocuments({
      class: classData._id,
      gender: "Male",
    });

    const numFemaleStudents = await Student.countDocuments({
      class: classData._id,
      gender: "Female",
    });

    // Add these values to response
    const finalResponse = {
      ...classData.toObject(),
      numMaleStudents,
      numFemaleStudents,
    };

    res.status(200).json(finalResponse);
  } catch (error) {
    next(error);
  }
};

export const getClasses = async (req, res, next) => {
  try {
    const Classes = await Class.find().populate("students").populate("teacher");
    return res.status(200).json(Classes);
  } catch (error) {
    next(error);
  }
};
export const getIdByName = async (req, res, next) => {
  try {
    const className = req.params.name;
    const classData = await Class.findOne({ name: className });
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(classData._id);
  } catch (error) {
    next(error);
  }
};
