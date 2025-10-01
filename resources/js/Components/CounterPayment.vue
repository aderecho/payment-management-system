<script setup>
import { ref, watch } from 'vue';
// import QRCode from 'qrcode';

const campusId = ref('');
const name = ref('');
const course = ref('');
const yearLevel = ref('');
const schoolYear = ref('');
const amount = ref('');
const qrCodeUrl = ref('');
const referenceCode = ref('');

// Watch for changes in input fields and update QR code
watch([campusId, name, course, yearLevel, schoolYear, amount], () => {
  generateQR();
});

// Function to generate a random reference code
const generateReferenceCode = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Function to generate the QR code
const generateQR = async () => {
  const data = {
    campusId: campusId.value,
    name: name.value,
    course: course.value,
    yearLevel: yearLevel.value,
    schoolYear: schoolYear.value,
    amount: amount.value,
    referenceCode: generateReferenceCode(), // Generate a new reference code
  };
  
  // Create a JSON string from the data
  const qrData = JSON.stringify(data);
  
  try {
    qrCodeUrl.value = await QRCode.toDataURL(qrData);
  } catch (err) {
    console.error(err);
  }
};

</script>

<template>
  
</template>