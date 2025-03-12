# ใช้ Python base image
FROM python:3.11-slim

# ตั้งค่า working directory
WORKDIR /app

# คัดลอกไฟล์ที่จำเป็นทั้งหมด
COPY . /app

# ติดตั้ง dependencies
RUN pip install --no-cache-dir -r requirements.txt

# รัน Python script
CMD ["python", "main.py"]
