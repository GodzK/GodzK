import os
import requests
import json
import subprocess

def update_readme(streak, gold):
    with open("README.md", "a") as f:
        f.write("\n## My Game Streak\n")
        f.write(f"Streak: {streak}\n")
        f.write(f"Gold: {gold}\n")

def commit_changes():
    subprocess.run(["git", "config", "--global", "user.name", "GodzK"])
    subprocess.run(["git", "config", "--global", "user.email", os.getenv("EMAIL")])
    subprocess.run(["git", "add", "README.md"])
    subprocess.run(["git", "commit", "-m", "Updated stats"])
    subprocess.run(["git", "push"])

def main():
    # ดึง inputs จาก environment variables
    waketime_key = os.getenv("INPUT_WAKATIME_API_KEY")
    gh_token = os.getenv("INPUT_GH_TOKEN")

    # ดึงข้อมูลจาก Streak-Farmer-RPG (ต้องใช้ PAT)
    headers = {"Authorization": f"token {gh_token}"}
    response = requests.get("https://raw.githubusercontent.com/GodzK/Streak-Farmer-RPG/main/reward.json", headers=headers)
    if response.status_code == 200:
        player_data = response.json()
    else:
        player_data = {"streak": 0, "gold": 0}

    # อัปเดต streak และ gold
    player_data["streak"] += 1
    player_data["gold"] += 10

    # อัปเดต README
    update_readme(player_data["streak"], player_data["gold"])

    # Commit การเปลี่ยนแปลง
    commit_changes()

    print(f"Updated streak: {player_data['streak']}, gold: {player_data['gold']}")

if __name__ == "__main__":
    main()
