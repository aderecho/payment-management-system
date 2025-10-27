// Mock Data for auto fill, mock data for TransactionMockData.vue


export const MOCK_TRANSACTION_DATA = [
    {
        campusId: 'C1001',
        studentName: 'Alice Johnson',
        Email: 'alice.johnson@university.edu', 
        referenceCode: 'REF-001234',
        paymentMethod: 'Bank',
        transactionType: 'Tuition Fee',
        amount: 25000.00,
        date: '10/05/2025', // MM/DD/YYYY format
        status: 'Posted',
        course: 'BS Computer Science',
        yearLevel: '4th Year', 
        schoolYear: '2025-2026', 
        details: 'Full tuition payment for Fall 2025 semester.',
        processedBy: 'Admin User 1'
    },
    {
        campusId: 'C1005',
        studentName: 'Bob Smith',
        Email: 'bob.smith@university.edu', // ADDED
        referenceCode: 'REF-001235',
        paymentMethod: 'Cash', // Matches "Cash"
        transactionType: 'Miscellanous Fee',
        amount: 550.50,
        date: '10/04/2025',
        status: 'Floating',
        course: 'BA English Literature',
        yearLevel: '2nd Year', 
        schoolYear: '2025-2026', 
        details: 'Payment for library late return fees.',
        processedBy: 'Admin User 2'
    },
    {
        campusId: 'C1010',
        studentName: 'Charlie Brown',
        Email: 'charlie.brown@university.edu', // ADDED
        referenceCode: 'REF-001236',
        paymentMethod: 'Bank',
        transactionType: 'Tuition Fee',
        amount: 15000.00,
        date: '10/03/2025',
        status: 'Cancelled',
        course: 'BSc Biology',
        yearLevel: '3rd Year', 
        schoolYear: '2024-2025', 
        details: 'Partial tuition fee payment.',
        processedBy: 'Admin User 3'
    },
    
    {
        campusId: 'C1022',
        studentName: 'Dana Scully',
        Email: 'dana.scully@university.edu', // ADDED
        referenceCode: 'REF-001237',
        paymentMethod: 'Maya',
        transactionType: 'Books',
        amount: 1200.75,
        date: '09/30/2025',
        status: 'Pending',
        course: 'MS Physics',
        yearLevel: '1st Year Grad', 
        schoolYear: '2025-2026', 
        details: 'Purchase of required textbooks.',
        processedBy: 'Admin User 1'
    },
    {
        campusId: 'C1033',
        studentName: 'Fox Mulder',
        Email: 'fox.mulder@university.edu', // ADDED
        referenceCode: 'REF-001238',
        paymentMethod: 'Gcash', // Should NOT match "Cash"
        transactionType: 'Tuition Fee',
        amount: 8000.00,
        date: '09/28/2025',
        status: 'Posted',
        course: 'PhD Paranormal Studies',
        yearLevel: '2nd Year Grad', 
        schoolYear: '2025-2026', 
        details: 'Installment payment.',
        processedBy: 'Admin User 4'
    },
    {
        campusId: 'C1044',
        studentName: 'Eliza Thorne',
        Email: 'eliza.thorne@university.edu', // ADDED
        referenceCode: 'REF-001239',
        paymentMethod: 'Bank',
        transactionType: 'Tuition Fee',
        amount: 32000.00,
        date: '08/15/2025', // August 2025
        status: 'Pending',
        course: 'BFA Digital Arts',
        yearLevel: '1st Year', 
        schoolYear: '2025-2026', 
        details: 'Full tuition for the academic year.',
        processedBy: 'Admin User 5'
    },
    {
        campusId: 'C1055',
        studentName: 'Gary Oldman',
        Email: 'gary.oldman@university.edu', // ADDED
        referenceCode: 'REF-001240',
        paymentMethod: 'Cash',
        transactionType: 'ID Replacement',
        amount: 350.00,
        date: '10/20/2025', // Latest Date
        status: 'Floating',
        course: 'BS Chemistry',
        yearLevel: '3rd Year', 
        schoolYear: '2025-2026', 
        details: 'Fee for new student ID card.',
        processedBy: 'Admin User 2'
    },
    
    {
        campusId: 'C1077',
        studentName: 'Ian Malcolm',
        Email: 'ian.malcolm@university.edu', // ADDED
        referenceCode: 'REF-001242',
        paymentMethod: 'Gcash',
        transactionType: 'Dormitory Fee',
        amount: 9500.00,
        date: '07/10/2025',
        status: 'Cancelled',
        course: 'PhD Mathematics',
        yearLevel: '3rd Year Grad', 
        schoolYear: '2025-2026', 
        details: 'Monthly dormitory payment (later cancelled).',
        processedBy: 'Admin User 1'
    },
    {
        campusId: 'C1088',
        studentName: 'Jane Foster',
        Email: 'jane.foster@university.edu', // ADDED
        referenceCode: 'REF-001243',
        paymentMethod: 'Maya',
        transactionType: 'Tuition Fee',
        amount: 18000.00,
        date: '09/01/2025',
        status: 'Cancelled',
        course: 'MS Astrophysics',
        yearLevel: '1st Year Grad', 
        schoolYear: '2025-2026', 
        details: 'Second tuition installment.',
        processedBy: 'Admin User 4'
    },

];

// Export a specific subset of data for the autofill process
export const studentDataForAutofill = MOCK_TRANSACTION_DATA.map(t => ({
    campusId: t.campusId,
    name: t.studentName, // Note the mapping: studentName -> name
    course: t.course,
    yearLevel: t.yearLevel,
    schoolYear: t.schoolYear,
}));