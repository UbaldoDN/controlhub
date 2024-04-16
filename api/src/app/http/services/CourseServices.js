import Course from "../../models/Course.js";

const store = async (title, isApproved, isAvailable, lessons) => {
    const course = new Course({
        title: title,
        is_approved: isApproved,
        is_avaiable: isAvailable,
        lessons: lessons,
    });

    return await course.save();
}

const update = async (title, isApproved, lessons, courseId) => {
    const course = await get(courseId);
    course.title = title;
    course.is_approved = isApproved;
    course.is_avaiable = isAvailable;
    course.lessons = lessons;
    
    return await course.save();
}

const destroy = async (courseId) => {
    return await Course.deleteOne({ _id: courseId });
}

const get = async (courseId) => {
    return await Course.findById(courseId);
}

const list = async () => {
    return await Course.find({});
}

export default {
    destroy,
    store,
    update,
    get,
    list,
}