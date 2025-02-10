To turn the documentation into a proper GitHub `README.md` file, it needs to follow a Markdown structure suitable for GitHub. Here’s the converted documentation:

---

# Triggers Documentation

This documentation explains how to use the **Triggers Documentation** project to log triggers created in Google Apps Script into a Google Spreadsheet. 

## Objective

The purpose of this project is to monitor and log triggers created in Google Apps Script to help track their usage, status, and metadata over time.

### Logged Data Fields

The following fields will be recorded in the Google Spreadsheet:

```javascript
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
```

---

## Setup Instructions

### 1. Create a New Google Apps Script Project
1. Open [Google Apps Script](https://script.google.com/).
2. Create a new project and name it `triggers-report`.

### 2. Add Scripts to the Project
1. Copy the content of `triggers-report.js` and paste it into a script file in your Google Apps Script project.
2. Move the `triggers-report.gs` script file to the top of the script list by selecting **Move up**.

### 3. Embed Code in Trigger-Associated Functions
Add the following snippet at the end of each function associated with a trigger:

```javascript
PropertiesService.getScriptProperties().setProperty("function_name", new Triggers().formattedTime);
```

#### Important:
- Replace `"function_name"` with the actual name of the function. For example, if the function is `onEdit`, the code becomes:
  
  ```javascript
  PropertiesService.getScriptProperties().setProperty("onEdit", new Triggers().formattedTime);
  ```

### 4. Run reportTriggers() manually first
need to be authenticated first, before we set auto trigger.

### 5. Create a Time-Based Trigger
1. Open the **Triggers** menu in the Apps Script editor.
2. Add a new trigger for the `reportTriggers()` function:
   - **Function to run**: `reportTriggers`
   - **Deployment**: Head
   - **Event source**: Time-driven
   - **Type of time-based trigger**: Minutes timer
   - **Interval**: Every 5 minutes.

---

## Expected Output

The script will log the following data in a Google Spreadsheet:

| Timestamp          | Project Name    | Trigger ID | Function Name | Event Type | Source Type | Origin File | Last Run Time   |
|--------------------|-----------------|------------|---------------|------------|-------------|-------------|-----------------|
| 2025-01-16 10:00  | triggers-report | abc123     | onEdit        | timeDriven | web         | main.gs     | 2025-01-16 09:55|

---

## Additional Notes

- Ensure the `reportTriggers()` function is correctly implemented in the project.
- Verify that the Google Spreadsheet where the logs are saved is accessible and has sufficient permissions.
- For debugging, check the Apps Script Execution Logs if any errors occur.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

### Ready to Use
Copy and paste this `README.md` file into the root of your GitHub repository. Let me know if you'd like further modifications or additional sections!