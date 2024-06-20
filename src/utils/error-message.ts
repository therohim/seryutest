class ErrorMessage {
    public static errorMessage: ErrorMessage = new ErrorMessage();

    fieldsRequired(fields: Array<string>): string {
        return `${fields} is required`;
    }

    failDeleted(subject: string): string {
        return `${subject} failed to delete`;
    }

    failDeletedParent(subject: string, subject2: string): string {
        return `You can't delete ${subject} !, ${subject} has ${subject2} in it, delete all ${subject2} to continue`;
    }

    failDeletedParentObject(subject: string, subject2: string): object {
        return {
            title: `You can't delete ${subject} !`,
            message: `${subject} has ${subject2} in it, delete all ${subject2} to continue`
        };
    }

    alreadyAssigned(subject: string): string {
        return `${subject} already assigned`;
    }

    alreadyExist(subject: string): string {
        return `${subject} already used`;
    }

    notFound(subject: string): string {
        return `${subject} not found`;
    }
    found(subject: string, subject2: string): string {
        return `${subject} has ${subject2} in it,`;
    }

    wrongPassword(subject: string): string {
        return `${subject} is wrong`;
    }

    general(subject: string): string {
        return `${subject}`;
    }
}

export default new ErrorMessage();
