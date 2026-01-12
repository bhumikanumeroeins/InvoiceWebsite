

export const createResult = (data) => {
    return { status: "sucess", data};
}

export const createError = (error) => {
    return { status: "error", error};
}


