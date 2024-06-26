import LessonServices from "../services/LessonServices.js";
import CourseServices from "../services/CourseServices.js";

const index = async (request, response) => {
    try {
        const { courseId } = request.params;
        const course = await CourseServices.get(courseId);
        
        if (!course) {
            return response.json([]);
        }
        
        await course.populate("lessons");
        const lessonList = await Promise.all(course.lessons.map(async (lesson) => {
            return await responseJsonFormat(lesson)
        }));

        response.json(lessonList);
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Error al obtener el listado de lecciones." })
    }
};

const store = async (request, response) => {
    try {
        const { courseId } = request.params;
        const { title, threshold } = request.body;
        const lesson = await LessonServices.store(title, threshold, false, []);
        await CourseServices.pushLessonId(lesson._id, courseId);
        response.status(201).json(await responseJsonFormat(lesson));
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Error al guardar la lección.", errorMessage: error}); 
    }
};

const update = async (request, response) => {
    try {      
        const { lessonId } = request.params;
        const { title, threshold } = request.body;
        const lesson = await LessonServices.update(title, threshold, lessonId);
        response.json(await responseJsonFormat(lesson));
    } catch (error) {
        console.log("error", error);
        response.status(500).json({ message: "Error al actualizar la lección.", errorMessage: error}); 
    }
};

const updateAvailable = async (request, response) => {
    try {
        const { lessonId } = request.params;
        const { available } = request.body;
        const lesson = await LessonServices.updateAvailable(available, lessonId);
        response.json(await responseJsonFormat(lesson));
    } catch (error) {
        console.log("error", error);
        response.status(500).json({ message: "Error al actualizar la disponibilidad del curso.", errorMessage: error}); 
    }
};

const get = async (request, response) => {
    try {
        const { lessonId } = request.params;
        const lesson = await LessonServices.get(lessonId);
        response.json(await responseJsonFormat(lesson));
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Error al obtener la lección." })
    }
};

const destroy = async (request, response) => {
    try {
        const { lessonId } = request.params;
        await LessonServices.destroy(lessonId);
        response.status(204).json();
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Error al eliminar la lección." })
    }
};

const responseJsonFormat = async (lesson) => {
    let populateQuestions = [];
    if (lesson.questions && lesson.questions.length > 0) {
        await lesson.populate("questions");
        populateQuestions = lesson.questions.map( question => {
            return {
                id: question._id,
                type: question.type,
                content: question.content,
                answers: question.answers,
                correctAnswers: question.correct_answers,
                points: question.points,
            }
        } );
    }

    return {
        id: lesson._id,
        title: lesson.title,
        threshold: lesson.threshold,
        isAvailable: lesson.is_available,
        isApproved: lesson.is_approved,
        questions: populateQuestions
    }
};

export default {
    store,
    update,
    updateAvailable,
    get,
    index,
    destroy
};