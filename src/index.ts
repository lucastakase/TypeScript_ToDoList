enum NotificationPlatform {
    SMS = "SMS",
    EMAIL = "EMAIL",
    PUSH_NOTIFICATION = "PUSH_NOTIFICATION",
}

enum ViewMode {
    TODO = "TODO",
    REMINDER = "REMINDER",
}

interface Task {
    id: string;
    dateCreated: Date;
    dateUpdated: Date;
    description: string;
    render(): string;
}

const UUID = (): string => {
    return Math.random().toString(36).substring(2, 15);
};

const DateUtils = {
    tomorrow(): Date {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    },
    today(): Date {
        return new Date();
    },
    formatDate(date: Date): string {
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        return date.toLocaleDateString('pt-BR', options);
    },
};

class Reminder implements Task {
    id: string = UUID();
    dateCreated: Date = DateUtils.today();
    dateUpdated: Date = DateUtils.today();
    description: string = "";

    date: Date = DateUtils.tomorrow();
    notifications: NotificationPlatform[] = [NotificationPlatform.EMAIL];

    constructor(description: string, date: Date, notifications: NotificationPlatform[]) {
        this.description = description;
        this.date = date;
        this.notifications = notifications;
    }

    render(): string {
        return `
        <h3>Reminder</h3>
        description: ${this.description}<br>
        date: ${DateUtils.formatDate(this.date)}<br>
        platform: ${this.notifications.join(",")}<br>
        `;
    }
}

class Todo implements Task {
    id: string = UUID();
    dateCreated: Date = DateUtils.today();
    dateUpdated: Date = DateUtils.today();
    description: string = "";

    done: boolean = false;

    constructor(description: string) {
        this.description = description;
    }

    render(): string {
        return `
        <h3> TODO </h3
        description: ${this.description}<br>
        done: ${this.done ? "✅" : "❌"}<br>
        `;
    }
}

const taskView = {
    getTodo(form: HTMLFormElement): Todo {
        const todoDescription = (form.elements.namedItem('todoDescription') as HTMLInputElement).value;
        form.reset();
        return new Todo(todoDescription);
    },

    getReminder(form: HTMLFormElement): Reminder {
        const reminderNotifications = [
            (form.elements.namedItem('notifications') as HTMLSelectElement).value as NotificationPlatform,
        ];
        const reminderDate = new Date((form.elements.namedItem('reminderDate') as HTMLInputElement).value);
        const reminderDescription = (form.elements.namedItem('reminderDescription') as HTMLInputElement).value;
        form.reset();
        return new Reminder(reminderDescription, reminderDate, reminderNotifications);
    },

    render(tasks: Task[]) {
        const taskList = document.getElementById("taskList");
        if (!taskList) return;

        taskList.innerHTML = "";

        tasks.forEach((task) => {
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            li.innerHTML = task.render(); // Usar innerHTML aqui
            taskList.appendChild(li);
        });
    }
};

const TaskController = (view: typeof taskView) => {
    const tasks: Task[] = [];
    let mode: ViewMode = ViewMode.TODO;

    const handlerEvent = (event: Event) => {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement;

        try {
            let newTask: Task;
            if (mode === ViewMode.TODO) {
                newTask = view.getTodo(form);
            } else {
                newTask = view.getReminder(form);
            }
            tasks.push(newTask);
            view.render(tasks);
        } catch (error) {
            console.error("Error creating task:", error);
            alert("Erro ao criar tarefa. Verifique os campos.");
        }
    };

    const handleToggleMode = () => {
        const todoForm = document.getElementById("todoForm") as HTMLFormElement;
        const reminderForm = document.getElementById("reminderForm") as HTMLFormElement;
        const toggleButton = document.getElementById("toggleMode") as HTMLButtonElement;

        if (mode === ViewMode.TODO) {
            mode = ViewMode.REMINDER;
            todoForm.style.display = "none";
            reminderForm.style.display = "block";
            toggleButton.textContent = "Switch to Todo Mode";
        } else {
            mode = ViewMode.TODO;
            todoForm.style.display = "block";
            reminderForm.style.display = "none";
            toggleButton.textContent = "Switch to Reminder Mode";
        }
    };

    document.getElementById("toggleMode")?.addEventListener("click", handleToggleMode);
    document.getElementById("todoForm")?.addEventListener("submit", handlerEvent);
    document.getElementById("reminderForm")?.addEventListener("submit", handlerEvent);

    view.render(tasks); // Renderiza a lista inicialmente
};

TaskController(taskView);