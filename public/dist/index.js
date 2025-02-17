"use strict";
var NotificationPlatform;
(function (NotificationPlatform) {
    NotificationPlatform["SMS"] = "SMS";
    NotificationPlatform["EMAIL"] = "EMAIL";
    NotificationPlatform["PUSH_NOTIFICATION"] = "PUSH_NOTIFICATION";
})(NotificationPlatform || (NotificationPlatform = {}));
var ViewMode;
(function (ViewMode) {
    ViewMode["TODO"] = "TODO";
    ViewMode["REMINDER"] = "REMINDER";
})(ViewMode || (ViewMode = {}));
var UUID = function () {
    return Math.random().toString(36).substring(2, 15);
};
var DateUtils = {
    tomorrow: function () {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    },
    today: function () {
        return new Date();
    },
    formatDate: function (date) {
        var options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        return date.toLocaleDateString('pt-BR', options);
    },
};
var Reminder = /** @class */ (function () {
    function Reminder(description, date, notifications) {
        this.id = UUID();
        this.dateCreated = DateUtils.today();
        this.dateUpdated = DateUtils.today();
        this.description = "";
        this.date = DateUtils.tomorrow();
        this.notifications = [NotificationPlatform.EMAIL];
        this.description = description;
        this.date = date;
        this.notifications = notifications;
    }
    Reminder.prototype.render = function () {
        return "\n        <h3>Reminder</h3>\n        description: ".concat(this.description, "<br>\n        date: ").concat(DateUtils.formatDate(this.date), "<br>\n        platform: ").concat(this.notifications.join(","), "<br>\n        ");
    };
    return Reminder;
}());
var Todo = /** @class */ (function () {
    function Todo(description) {
        this.id = UUID();
        this.dateCreated = DateUtils.today();
        this.dateUpdated = DateUtils.today();
        this.description = "";
        this.done = false;
        this.description = description;
    }
    Todo.prototype.render = function () {
        return "\n        <h3> TODO </h3\n        description: ".concat(this.description, "<br>\n        done: ").concat(this.done ? "✅" : "❌", "<br>\n        ");
    };
    return Todo;
}());
var taskView = {
    getTodo: function (form) {
        var todoDescription = form.elements.namedItem('todoDescription').value;
        form.reset();
        return new Todo(todoDescription);
    },
    getReminder: function (form) {
        var reminderNotifications = [
            form.elements.namedItem('notifications').value,
        ];
        var reminderDate = new Date(form.elements.namedItem('reminderDate').value);
        var reminderDescription = form.elements.namedItem('reminderDescription').value;
        form.reset();
        return new Reminder(reminderDescription, reminderDate, reminderNotifications);
    },
    render: function (tasks) {
        var taskList = document.getElementById("taskList");
        if (!taskList)
            return;
        taskList.innerHTML = "";
        tasks.forEach(function (task) {
            var li = document.createElement("li");
            li.classList.add("list-group-item");
            li.innerHTML = task.render(); // Usar innerHTML aqui
            taskList.appendChild(li);
        });
    }
};
var TaskController = function (view) {
    var _a, _b, _c;
    var tasks = [];
    var mode = ViewMode.TODO;
    var handlerEvent = function (event) {
        event.preventDefault();
        var form = event.currentTarget;
        try {
            var newTask = void 0;
            if (mode === ViewMode.TODO) {
                newTask = view.getTodo(form);
            }
            else {
                newTask = view.getReminder(form);
            }
            tasks.push(newTask);
            view.render(tasks);
        }
        catch (error) {
            console.error("Error creating task:", error);
            alert("Erro ao criar tarefa. Verifique os campos.");
        }
    };
    var handleToggleMode = function () {
        var todoForm = document.getElementById("todoForm");
        var reminderForm = document.getElementById("reminderForm");
        var toggleButton = document.getElementById("toggleMode");
        if (mode === ViewMode.TODO) {
            mode = ViewMode.REMINDER;
            todoForm.style.display = "none";
            reminderForm.style.display = "block";
            toggleButton.textContent = "Switch to Todo Mode";
        }
        else {
            mode = ViewMode.TODO;
            todoForm.style.display = "block";
            reminderForm.style.display = "none";
            toggleButton.textContent = "Switch to Reminder Mode";
        }
    };
    (_a = document.getElementById("toggleMode")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", handleToggleMode);
    (_b = document.getElementById("todoForm")) === null || _b === void 0 ? void 0 : _b.addEventListener("submit", handlerEvent);
    (_c = document.getElementById("reminderForm")) === null || _c === void 0 ? void 0 : _c.addEventListener("submit", handlerEvent);
    view.render(tasks); // Renderiza a lista inicialmente
};
TaskController(taskView);
