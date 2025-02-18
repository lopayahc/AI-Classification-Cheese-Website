const dropdownData = {
  milk: ['cow', 'sheep', 'goat', 'buffalo', 'water buffalo', 'plant-based', 'yak', 'camel', 'moose', 'donkey'],
  country: ['Switzerland', 'France', 'England', 'Great Britain', 'United Kingdom', 'Czech Republic', 'United States', 'Italy', 'Cyprus', 'Egypt', 'Israel', 'Jordan', 'Lebanon', 'Middle East', 'Syria', 'Sweden', 'Canada', 'Spain', 'Netherlands', 'Scotland', 'New Zealand', 'Germany', 'Australia', 'Austria', 'Portugal', 'India', 'Mexico', 'Greece', 'Ireland', 'Armenia', 'Finland', 'Iceland', 'Hungary', 'Belgium', 'Denmark', 'Turkey', 'Wales', 'Norway', 'Poland', 'Slovakia', 'Romania', 'Mongolia', 'Brazil', 'Mauritania', 'Bulgaria', 'China', 'Nepal', 'Tibet', 'Mexico and Caribbean'],
  type: ['semi-soft', 'semi-hard', 'artisan', 'brined', 'soft', 'hard', 'soft-ripened', 'blue-veined', 'firm', 'smear-ripened', 'fresh soft', 'organic', 'semi-firm', 'processed', 'whey', 'fresh firm'],
  fat_content : ['Low','Medium','High'],
  texture: ['buttery', 'creamy', 'dense', 'firm', 'elastic', 'smooth', 'open', 'soft', 'supple', 'crumbly', 'semi firm', 'springy', 'crystalline', 'flaky', 'spreadable', 'dry', 'fluffy', 'brittle', 'runny', 'compact', 'stringy', 'chalky', 'chewy', 'grainy', 'soft-ripened', 'close', 'gooey', 'oily', 'sticky'],
  rind: ['washed', 'natural', 'rindless', 'cloth wrapped', 'mold ripened', 'waxed', 'bloomy', 'artificial', 'plastic', 'ash coated', 'leaf wrapped', 'edible'],
  color: ['yellow', 'ivory', 'white', 'pale yellow', 'blue', 'orange', 'cream', 'brown', 'green', 'golden yellow', 'pale white', 'straw', 'brownish yellow', 'blue-grey', 'golden orange', 'red', 'pink and white'],
  flavor: ['sweet', 'burnt caramel', 'acidic', 'milky', 'smooth', 'fruity', 'nutty', 'salty', 'mild', 'tangy', 'strong', 'buttery', 'citrusy', 'herbaceous', 'sharp', 'subtle', 'creamy', 'pronounced', 'spicy', 'mellow', 'oceanic', 'earthy', 'butterscotch', 'full-flavored', 'smokey', 'garlicky', 'piquant', 'caramel', 'bitter', 'floral', 'grassy', 'savory', 'mushroomy', 'lemony', 'woody', 'sour', 'tart', 'pungent', 'meaty', 'licorice', 'yeasty', 'umami', 'vegetal', 'crunchy', 'rustic'],
  aroma: ['buttery', 'lanoline', 'aromatic', 'barnyardy', 'earthy', 'perfumed', 'pungent', 'nutty', 'floral', 'fruity', 'fresh', 'herbal', 'mild', 'milky', 'strong', 'sweet', 'rich', 'clean', 'goaty', 'grassy', 'smokey', 'spicy', 'garlicky', 'mushroom', 'lactic', 'pleasant', 'subtle', 'woody', 'fermented', 'yeasty', 'musty', 'pronounced', 'ripe', 'stinky', 'toasty', 'pecan', 'whiskey', 'raw nut', 'caramel']
};


// ฟังก์ชันสร้าง dropdowns
function createDropdowns(containerId) {
const container = document.getElementById(containerId);

Object.keys(dropdownData).forEach(category => {
  const dropdownButton = document.createElement('button');
  dropdownButton.className = 'dropdown-button';
  dropdownButton.id = `dropdownButton${category}`;
  dropdownButton.innerHTML = `Select ${category} <span class="arrow">&#9660;</span>`;

  const dropdownList = document.createElement('div');
  dropdownList.className = 'dropdown-content';
  dropdownList.id = `dropdownList${category}`;

  dropdownData[category].forEach(item => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" value="${item}"> ${item}`;
    dropdownList.appendChild(label);
  });

  const dropdownContainer = document.createElement('div');
  dropdownContainer.className = 'dropdown-container';
  dropdownContainer.appendChild(dropdownButton);
  dropdownContainer.appendChild(dropdownList);
  container.appendChild(dropdownContainer);

  setupDropdown(dropdownButton, dropdownList, category);
});
}

// ฟังก์ชันจัดการ dropdown
function setupDropdown(dropdownButton, dropdownList, category) {
dropdownButton.addEventListener('click', () => {
  dropdownList.classList.toggle('show');
  dropdownButton.classList.toggle('active');
});

const checkboxes = dropdownList.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const selected = Array.from(checkboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);

    dropdownButton.textContent = selected.length ? selected.join(', ') : `Select ${category}`;
  });
});

window.addEventListener('click', (e) => {
  if (!dropdownButton.contains(e.target) && !dropdownList.contains(e.target)) {
    dropdownList.classList.remove('show');
    dropdownButton.classList.remove('active');
  }
});
}


// ฟังก์ชันสำหรับจัดรูปแบบข้อมูลก่อนส่งไปยัง API
function formatData(data) {
  return Object.keys(data).map(key => {
    if (Array.isArray(data[key])) {
      return data[key].length > 0 ? data[key].join(', ') : null;
    }
    return data[key] === "" ? null : data[key];
  });
}

async function sendDataToAPI(data) {
  console.log(data);

  const jsonData = { input: [formatData(data)] };
  console.log(JSON.stringify(jsonData, null, 2));

  try {
    const response = await fetch('http://3.27.122.97:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(jsonData),
    });

    console.log("API Response Status:", response.status);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    console.log("API Response Data:", result);

    const predictionArray = result.prediction;

    if (Array.isArray(predictionArray) && predictionArray.length > 0) {
      const prediction = predictionArray[0].trim().toLowerCase();
      console.log("Extracted Prediction:", prediction);

      const matchingRow = cheeseData.find(
        row => row.family.toLowerCase() === prediction
      );

      let displayText = `Prediction: ${predictionArray[0]}\n`;

      if (matchingRow) {
        displayText += `อาหาร: ${matchingRow['อาหาร'] || 'N/A'}\n`;
        displayText += `เครื่องดื่ม: ${matchingRow['เครื่องดื่ม'] || 'N/A'}\n`;
        displayText += `รายละเอียด: ${matchingRow['รายละเอียด'] || 'N/A'}`;

        // ตรวจสอบและแสดงรูปภาพ
        const imageName = `${prediction}.jpg`; // เปลี่ยนตามนามสกุลไฟล์ที่ใช้
        const imagePath = `./${imageName}`; // รูปอยู่ในโฟลเดอร์เดียวกัน

        const imageElement = document.createElement('img');
        imageElement.src = imagePath;
        imageElement.alt = `Image of ${prediction}`;
        imageElement.style.maxWidth = '100%';

        const container = document.querySelector('.rectangle-5');
        if (container) {
          container.innerHTML = ''; // ล้างเนื้อหาก่อน
          container.appendChild(imageElement);

          // ตรวจสอบว่ารูปโหลดสำเร็จหรือไม่
          imageElement.onerror = () => {
            console.error(`ไม่พบรูปภาพ: ${imagePath}`);
            container.textContent = 'Image not found.';
          };
        } else {
          console.error('.rectangle-5 ไม่พบใน DOM');
        }
      } else {
        displayText += 'No matching data found in Excel.';
      }

      document.querySelector('.rectangle-4').textContent = displayText;
    } else {
      console.error("Prediction is empty or not an array.");
      document.querySelector('.rectangle-4').textContent = 'No prediction data received.';
    }

    await sendResultToAnotherAPI();

  } catch (error) {
    console.error("Error in API call:", error);
    document.querySelector('.rectangle-4').textContent = 'Error occurred while fetching prediction.';
  }
}


// ฟังก์ชันส่งข้อมูลไปยัง API ที่สอง
async function sendResultToAnotherAPI() {
  try {
    // ทำการแทรกข้อมูลใหม่ลงในตำแหน่งที่ 2 ของ array (คุณอาจต้องการปรับให้ตรงกับโครงสร้างของข้อมูลที่ต้องการส่งไปยัง API)
    const response = await fetch('http://127.0.0.1:5000/cheese', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });

    // ตรวจสอบสถานะการตอบสนอง
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    document.querySelector('.rectangle-5').textContent = `Prediction_Cheese: ${result.data}`;

    console.log('Data successfully sent to the second API:', result);
  } catch (error) {
    console.error('Error sending data to the second API:', error);
  }
}


// ฟังก์ชันสำหรับอ่านข้อมูลจากไฟล์ Excel
async function loadExcelData(file) {
  try {
    const response = await fetch(file);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // แปลงข้อมูล Excel เป็น JSON
    const data = XLSX.utils.sheet_to_json(sheet);
    console.log('Excel Data Loaded:', data);
    return data;
  } catch (error) {
    console.error('Error loading Excel file:', error);
    document.querySelector('.rectangle-4').textContent = 'Error loading Excel data.';
    return [];
  }
}

// โหลดข้อมูล Excel เมื่อหน้าเว็บพร้อม
let cheeseData = [];
document.addEventListener('DOMContentLoaded', async () => {
  cheeseData = await loadExcelData('./cheesenemo.xlsx');

});


// ฟังก์ชันรวบรวมข้อมูลและส่งเมื่อกดปุ่มยืนยัน
document.addEventListener('DOMContentLoaded', () => {
const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', () => {
  const result = {};

  // รวบรวมข้อมูลจาก dropdowns
  Object.keys(dropdownData).forEach(category => {
    const dropdownList = document.getElementById(`dropdownList${category}`);
    const checkboxes = dropdownList.querySelectorAll('input[type="checkbox"]');
    const selected = Array.from(checkboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value);
    result[category] = selected;
  });

  // รวบรวมข้อมูลจาก checkbox vegetarian และ vegan
  const vegetarian = document.getElementById('vegetarian').checked;
  const vegan = document.getElementById('vegan').checked;
  result['vegetarian'] = [];
  result['vegan'] = [];
  // ใช้ if-else ในการตั้งค่าค่าของ vegetarian และ vegan
  result['vegetarian'] = vegetarian ? 'TRUE' : 'FALSE';
  result['vegan'] = vegan ? 'TRUE' : 'FALSE';

  // แสดงผลลัพธ์ใน console
  console.log('Selected Options:', result);
  
  // ส่งข้อมูลไปยัง API และแสดงผลใน rectangle-6
  sendDataToAPI(result);

  // รีเซ็ต dropdown และ checkbox
  Object.keys(dropdownData).forEach(category => {
    const dropdownButton = document.getElementById(`dropdownButton${category}`);
    dropdownButton.textContent = `Select ${category}`;

    const dropdownList = document.getElementById(`dropdownList${category}`);
    const checkboxes = dropdownList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
  });

  document.getElementById('vegetarian').checked = false;
  document.getElementById('vegan').checked = false;
});
});

// เรียกใช้งานฟังก์ชันสร้าง dropdowns
createDropdowns('dropdowns-container');