const express = require('express');
const cors = require('cors'); // นำเข้า cors
const axios = require('axios');

const app = express();
const port = 3000;

// ใช้งาน CORS middleware
app.use(cors());
app.use(express.json()); // Middleware สำหรับจัดการข้อมูลแบบ JSON

// สร้างตัวแปรเพื่อเก็บ logs
let logs = []; // ใช้เพื่อเก็บ log ที่เข้ามา

// สร้างเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`API Server running on http://localhost:${port}`);
});

// GET /configs/:id endpoint สร้าง Endpoint สำหรับดึงข้อมูลการตั้งค่า Drone
app.get('/configs/:id', async (req, res) => {
    const { id } = req.params;  // รับ Drone ID จาก URL
    try {
        const response = await axios.get('https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec');
        const config = response.data; // สมมติว่า response ส่งข้อมูลการตั้งค่ากลับมา

        // ตรวจสอบให้แน่ใจว่า config มีข้อมูลที่ถูกต้อง
        console.log(config); // เพิ่มบรรทัดนี้เพื่อตรวจสอบข้อมูลที่ได้จาก API

        // ปรับแก้ไขค่า max_speed ตามเงื่อนไขที่กำหนด
        if (!config.max_speed) {
            config.max_speed = 100;
        } else if (config.max_speed > 110) {
            config.max_speed = 110;
        }

        res.json(config); // ส่งข้อมูลกลับไปยังผู้เรียก
    } catch (error) {
        res.status(500).json({ message: 'Error fetching config data', error });
    }
});

// GET /status/:id endpoint สร้าง Endpoint สำหรับดึงสถานะ Drone
app.get('/status/:id', (req, res) => {
  const { id } = req.params;
  const status = {
      condition: 'good'
  };

  res.json(status);
});

// GET /logs endpoint สร้าง Endpoint สำหรับดึงข้อมูลบันทึกของ Drone
app.get('/logs', (req, res) => {
  res.json(logs); // ส่ง logs ที่เก็บไว้กลับไป
});

// POST /logs endpoint สร้าง Endpoint สำหรับเพิ่มข้อมูลบันทึก
app.post('/logs', (req, res) => {
  const newLog = req.body; // รับข้อมูลใหม่จาก request body
  if (!newLog.drone_id || !newLog.drone_name || !newLog.country || newLog.celsius === undefined) {
      return res.status(400).json({ message: 'Invalid log data' });
  }

  // เพิ่ม log ใหม่ลงในตัวแปร logs
  newLog.created = new Date().toISOString(); // เพิ่ม timestamp
  logs.push(newLog); // เก็บ log ใหม่ลงใน array

  res.status(201).json({ message: 'Log added successfully', log: newLog });
});
