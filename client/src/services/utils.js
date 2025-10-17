export const getDateAndTime = (date, shortWeekday) => {

    const options = {
        weekday: shortWeekday ? "short" : 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    };
    if (date)
        return new Date(date).toLocaleString('en-IN', options);

}

export const getDate = (date) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }; if (date)
        return new Date(date).toLocaleString('en-IN', options);
}

export const getDateAndDay = (date, shortWeekday) => {
    const options = {
        weekday: shortWeekday ? "short" : 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }; if (date)
        return new Date(date).toLocaleString('en-IN', options);
}

export const getTime = (date) => {
    const createdAt = new Date(date);
    let indiaTimeFormatter = new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata' // Specify the time zone for India
    });
    if (date)
        return indiaTimeFormatter.format(createdAt);
}

export const userDetailsFormValidation = (userDetails) => {
    const errors = {
        isError: false
    };

    userDetails.fullname?.length < 2
        ? errors.fullname = "Fullname should be minimum 2 alphabate long!"
        : (errors.fullname = "");

    userDetails.about?.length < 20
        ? (errors.about = "Write minimum 20 alphabates about yourself!")
        : (errors.about = "");

    userDetails.phone?.length < 10 && userDetails.phone?.length > 0
        ? (errors.phone = "Phone number must contain 10 numbers!")
        : (errors.phone = "");

    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userDetails.email)
        ? (errors.email = "Enter a valid email!")
        : (errors.email = "");

    errors.isError = Boolean(errors.fullname || errors.about || errors.phone || errors.email);

    return errors;
};

export const passwordFormValidation = (passwords) => {
    const errors = {
        isError: false
    }

    errors.newPassword = passwords.newPassword?.length ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(passwords.newPassword) ? "" : "Enter password with all the rules!" : "";

    errors.currentPassword = passwords.currentPassword?.length > 0 && passwords.currentPassword.length < 8 ? "Current password is required!" : "";

    errors.confirmPassword = passwords.confirmPassword?.length ? passwords.confirmPassword !== passwords.newPassword ? "Password does not match!" : "" : "";

    errors.isError = Boolean(errors.currentPassword || errors.newPassword || errors.confirmPassword);

    return errors;
}

export const validateChapters = (chapters) => {
    const errors = {
        isError: false,
        chapters: [],
    };
    if (chapters.length) {
        chapters.forEach((chapter) => {
            const chapterError = {
                isError: false,
            };
            if (chapter.name?.length < 10) {
                chapterError.name = "Chapter name must contain mimimum 10 characters!";
                chapterError.isError = true;
            }
            if (chapter.content.length < 20) {
                chapterError.content = "Chapter content must contain mimimum 20 characters!";
                chapterError.isError = true;
            }
            errors.isError = chapterError.isError || errors.isError;
            errors.chapters.push(chapterError);
        });
    }
    return errors;
}

export const validateCourseDetails = (courseDetails) => {
    const errors = {
        isError: false
    };

    if (courseDetails.title?.length && courseDetails.title?.length < 10) errors.title = "Course title must be at least 10 alphabates long!";

    if (courseDetails.price && courseDetails.price < 10) errors.price = "Minimum course price must be 10 rupees!";

    if (courseDetails.description?.length && courseDetails.description?.length < 20) errors.description = "Description must contain minimum 20 characters!";

    if (courseDetails.alias?.length && courseDetails.alias?.length < 10) errors.alias = "Alias must contain minimum 10 characters!";

    // if (courseDetails.type === "selected") errors.type = "Select the type of course!";


    errors.isError = errors.title || errors.price || errors.description || errors.alias || errors.type;

    return errors;

}

export const validateLecture = (lectureDetails) => {
    const errors = {
        isError: false
    };

    if (lectureDetails.title?.length && lectureDetails.title?.length < 10) errors.title = "Lecture title must be at least 10 alphabates long!";

    if (lectureDetails.description?.length && lectureDetails.description?.length < 20) errors.description = "Description must contain minimum 20 characters!";

    errors.isError = errors.title || errors.description;

    return errors;
}






