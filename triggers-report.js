class Triggers {
    constructor(projectName) {
        this.today = new Date();
        this.formattedTime = Utilities.formatDate(this.today, "Asia/Jakarta", "dd MMMM yyyy, HH:mm 'WIB'");
        this.projectName = projectName;
        this.CENTRAL_SPREADSHEET_ID = "13EIr1r3jJK73ii76J8ZG50ZOm1uwc7G7Wj9ijqU1GP0";
        this.CENTRAL_SHEET_NAME = "triggers_detail";
    }

    getLastRunTime() {
        const properties = PropertiesService.getScriptProperties().getProperties();
        return properties;
    }

    getSsUrl() {
        const ss = SpreadsheetApp.getActive();
        let url
        if (!ss) {
            url = `https://script.google.com/u/0/home/projects/${ScriptApp.getScriptId()}/edit`;
        } else {
            url = ss.getUrl();
        }
        return url;
    }

    logTriggerDetails() {
        const triggers = ScriptApp.getProjectTriggers();
        const triggerDetails = [];
        triggers.forEach(trigger => {
            const funcName = trigger.getHandlerFunction();
            if (funcName !== "reportTriggers") {
                const details = {
                    trigger_id: trigger.getUniqueId(),
                    function_name: funcName,
                    event_type: String(trigger.getEventType()),
                    source_type: String(trigger.getTriggerSource()),
                    origin_file: this.getSsUrl(),
                    last_run_time: this.getLastRunTime()[funcName] || "No timestamp found"
                }
                triggerDetails.push(details);
            }
        })
        return triggerDetails;
    }

    sendDataToCentralFile() {
        const ss = SpreadsheetApp.openById(this.CENTRAL_SPREADSHEET_ID);
        const sheet = ss.getSheetByName(this.CENTRAL_SHEET_NAME);
        if (!sheet) throw new Error(`sheet: ${this.CENTRAL_SHEET_NAME} not found. please check`);
        let values = sheet.getDataRange().getValues();
        if (values.length === 1) {
            const header = [
                "timestamp",
                "project_name",
                "trigger_id",
                "function_name",
                "event_type",
                "source_type",
                "origin_file",
                "last_run_time"
            ];
            sheet.appendRow(header);
            values = [header];
        }

        const header = values.shift();
        const projectNameIndex = header.indexOf("project_name");
        const triggerIdIndex = header.indexOf("trigger_id");

        if (projectNameIndex === -1 && triggerIdIndex === -1) throw new Error(`cannot found project_name && trigger_id headers`);

        const log = this.logTriggerDetails();
        const keys = new Map();
        const rowsToAppend = [];

        values.forEach((row, i) => {
            const projectName = row[projectNameIndex];
            const triggerId = row[triggerIdIndex];
            keys.set(`${projectName}-${triggerId}`, i + 2);
        });

        log.forEach(({ trigger_id, function_name, event_type, source_type, origin_file, last_run_time }) => {
            const key = `${this.projectName}-${trigger_id}`;
            if (!keys.has(key)) {
                sheet.appendRow([
                    this.today,
                    this.projectName,
                    trigger_id,
                    function_name,
                    event_type,
                    source_type,
                    origin_file,
                    last_run_time,
                ]);
                keys.set(key, sheet.getLastRow() + rowsToAppend.length);
            } else {
                const rowIndex = keys.get(key);
                sheet.getRange(rowIndex, 8).setValue(last_run_time);
            }
        });

        if (rowsToAppend.length > 0) {
            const startRow = sheet.getLastRow() + 1;
            const startCol = 1;
            sheet.getRange(startRow, startCol, rowsToAppend.length, rowsToAppend[0].length).setValues(rowsToAppend);
        }

    }
};


function reportTriggers() {
    const ss = SpreadsheetApp.getActive();
    const name = ss.getName();
    const trigger = new Triggers(name);
    trigger.sendDataToCentralFile();
}