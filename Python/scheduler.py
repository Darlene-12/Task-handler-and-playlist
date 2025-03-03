from flask import Flask , request, jsonify
from apscheduler.schedulers.background import BackgroundScheduler
import time

app = Flask(__name__)

# Function to excecute the task
def execute_task(name):
    print(f" Executing Task: {name}")

# Route to schedule the task
@app.route("/schedule", methods = ["POST"])
def schedule_task():
    data = request.get_json()
    name = data.get("name")
    interval = data.get("time") # Time in seconds

    if not name or not interval:
        return jsonify({"error": "Task name and interval are required!"}), 400
    
    job = scheduler.add_job(execute_task, 'interval', seconds = int(interval), id=name, args=[name])
    tasks[name] = job
    return jsonify({"message": f"Task {name} scheduled successfully!"}), 200

#Route to list all the tasks
@app.route("/tasks", methods =["GET"])
def list_tasks():
    return jsonify(list(tasks.keys()))

# Route to remove the task
@app.route("stop/<name>", methods = ["DELETE"])
def stop_task(name):
    if name in tasks:
        tasks[name].remove()
        del tasks[name]
        return jsonify({"message": f"Task {name} stopped successfully!"}), 200
    return jsonify({"error": f"Task {name} not found!"}), 404

if __name__ == "__main__":
    app.run(debuhg = True, port = 5000)
