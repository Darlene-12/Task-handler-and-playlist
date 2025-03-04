from flask import Flask, request, jsonify
from apscheduler.schedulers.background import BackgroundScheduler
import time

app = Flask(__name__)
scheduler = BackgroundScheduler()
scheduler.start()

playlist = {}

# Function to play a song
def play_song(name):
    print(f" Now playing:{name}")


# Route to add a song to the playlist
@app.route("/add", methods = ["POST"])
def add_song():
    data = request.get_json()
    name = data.get("name")
    time_delay = data.get("time") # Delay in seconds

    if not name in time_delay:
        return jsonify({"error": "Song name and delay time required"}), 400
    job = scheduler.add_job(play_song, 'interval', seconds =int(time_delay), id=name, args=[name])
    playlist[name] = job
    return jsonify({"message": "Song added to playlist!", "name": name, "interval": time_delay })

# Route to list all the scheduled songs
@ app.route("/playlist", methods = ["GET"])
def list_song():
    return jsonify(list(playlist.keys()))

# Route to remove a song from the playlist
@app.route("/remove/<name>", methods = ["DELETE"])

def remove_song(name):
    if name in playlist:
        playlist[name].remove()
        del playlist[name]
        return jsonify({"message": f"Song{name} removed from playlist."})
    return jsonify({"error": f"Song {name} not found!"}), 404

if __name__ == "__main__":
    app.run(debug = True, port=5000)
