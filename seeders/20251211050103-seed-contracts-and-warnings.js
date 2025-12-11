'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // First, get IDs from master data to use as foreign keys
    // We'll use the codes to find the correct IDs
    const customers = await queryInterface.sequelize.query(
      `SELECT id, code FROM master_data_customers;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const statuses = await queryInterface.sequelize.query(
      `SELECT id, code FROM master_data_status;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const contractTypes = await queryInterface.sequelize.query(
      `SELECT id, code FROM master_data_contract_types;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const softwareTypes = await queryInterface.sequelize.query(
      `SELECT id, code, name FROM master_data_software;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const suppliers = await queryInterface.sequelize.query(
      `SELECT id, code FROM master_data_suppliers;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Helper functions to find IDs
    const findId = (array, code) => {
      const item = array.find(i => i.code === code);
      return item ? item.id : null;
    };

    const findIdByName = (array, name) => {
      const item = array.find(i => i.name === name);
      return item ? item.id : null;
    };

    // Create contracts
    const contract1Id = uuidv4();
    const contract2Id = uuidv4();
    const contract3Id = uuidv4();

    await queryInterface.bulkInsert('Contracts', [
      {
        id: contract1Id,
        code: 'HD-2025-001',
        signDate: '2025-01-15',
        customerId: findId(customers, 'KH001'), // Công ty Cổ phần Cảng Sài Gòn
        content: 'Triển khai hệ thống VTOS và Smartport',
        contractTypeId: findId(contractTypes, 'HD01'), // Triển khai mới
        valuePreVat: 500000000,
        vat: 50000000,
        valuePostVat: 550000000,
        duration: '12 Tháng',
        statusId: findId(statuses, 'ST02'), // Đang triển khai
        acceptanceDate: null,
        userId: null,
        createdAt: now,
        updatedAt: now
      },
      {
        id: contract2Id,
        code: 'HD-2025-002',
        signDate: '2025-02-10',
        customerId: findId(customers, 'KH009'), // Tân Cảng Sài Gòn
        content: 'Nâng cấp hệ thống Eport',
        contractTypeId: findId(contractTypes, 'HD01'), // Triển khai mới
        valuePreVat: 1200000000,
        vat: 120000000,
        valuePostVat: 1320000000,
        duration: '24 Tháng',
        statusId: findId(statuses, 'ST03'), // Hoàn thành
        acceptanceDate: '2025-02-28',
        userId: null,
        createdAt: now,
        updatedAt: now
      },
      {
        id: contract3Id,
        code: 'HD-2025-003',
        signDate: '2025-02-20',
        customerId: findId(customers, 'KH008'), // Cảng Nam Hải
        content: 'Bảo trì hệ thống M&R',
        contractTypeId: findId(contractTypes, 'HD02'), // Bảo trì
        valuePreVat: 200000000,
        vat: 20000000,
        valuePostVat: 220000000,
        duration: '12 Tháng',
        statusId: findId(statuses, 'ST01'), // Chưa thực hiện
        acceptanceDate: null,
        userId: null,
        createdAt: now,
        updatedAt: now
      }
    ], {});

    // Create ContractSoftware associations
    await queryInterface.bulkInsert('ContractSoftware', [
      { id: uuidv4(), contractId: contract1Id, softwareId: findIdByName(softwareTypes, 'VTOS'), createdAt: now, updatedAt: now },
      { id: uuidv4(), contractId: contract1Id, softwareId: findIdByName(softwareTypes, 'Smartport'), createdAt: now, updatedAt: now },
      { id: uuidv4(), contractId: contract2Id, softwareId: findIdByName(softwareTypes, 'Eport'), createdAt: now, updatedAt: now },
      { id: uuidv4(), contractId: contract3Id, softwareId: findIdByName(softwareTypes, 'M&R'), createdAt: now, updatedAt: now }
    ], {});

    // Create payment terms for contract 1
    await queryInterface.bulkInsert('payment_terms', [
      {
        id: uuidv4(),
        contractId: contract1Id,
        batch: 'Đợt 1',
        content: 'Tạm ứng',
        ratio: 30.00,
        value: 165000000,
        isCollected: true,
        collectionDate: '2025-01-20',
        invoiceStatus: 'exported',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        contractId: contract1Id,
        batch: 'Đợt 2',
        content: 'Nghiệm thu UAT',
        ratio: 40.00,
        value: 220000000,
        isCollected: false,
        collectionDate: null,
        invoiceStatus: 'not_exported',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        contractId: contract1Id,
        batch: 'Đợt 3',
        content: 'Nghiệm thu tổng thể',
        ratio: 30.00,
        value: 165000000,
        isCollected: false,
        collectionDate: null,
        invoiceStatus: 'not_exported',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        contractId: contract2Id,
        batch: 'Đợt 1',
        content: 'Ký hợp đồng',
        ratio: 50.00,
        value: 660000000,
        isCollected: true,
        collectionDate: '2025-02-15',
        invoiceStatus: 'exported',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        contractId: contract2Id,
        batch: 'Đợt 2',
        content: 'Golive',
        ratio: 50.00,
        value: 660000000,
        isCollected: false,
        collectionDate: null,
        invoiceStatus: 'not_exported',
        createdAt: now,
        updatedAt: now
      }
    ], {});

    // Create expenses for contract 1
    await queryInterface.bulkInsert('expenses', [
      {
        id: uuidv4(),
        contractId: contract1Id,
        category: 'Thuê Server',
        description: 'Server 32GB RAM, 8 Core',
        supplierId: findId(suppliers, 'NCC001'),
        totalAmount: 50000000,
        contractStatus: 'ST02',
        paymentStatus: 'paid',
        pic: 'Nguyễn Văn A',
        note: 'Thanh toán theo quý',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        contractId: contract1Id,
        category: 'Chi phí đi lại',
        description: 'Vé máy bay khứ hồi HCM-HP',
        supplierId: findId(suppliers, 'NCC002'),
        totalAmount: 10000000,
        contractStatus: 'ST03',
        paymentStatus: 'unpaid',
        pic: 'Trần Thị B',
        note: 'Công tác phí Hải Phòng',
        createdAt: now,
        updatedAt: now
      }
    ], {});

    // Create project members
    await queryInterface.bulkInsert('project_members', [
      { id: uuidv4(), contractId: contract1Id, memberCode: 'NV001', name: 'Nguyễn Văn A', role: 'PM', createdAt: now, updatedAt: now },
      { id: uuidv4(), contractId: contract1Id, memberCode: 'NV005', name: 'Lê Văn C', role: 'Dev', createdAt: now, updatedAt: now },
      { id: uuidv4(), contractId: contract2Id, memberCode: 'NV002', name: 'Trần Thị B', role: 'BA', createdAt: now, updatedAt: now }
    ], {});

    // Create warnings
    await queryInterface.bulkInsert('warnings', [
      {
        id: uuidv4(),
        type: 'payment_overdue',
        contractId: contract1Id,
        contractCode: 'HD-2025-001',
        customerName: 'Công ty Cổ phần Cảng Sài Gòn',
        dueDate: '2025-02-15',
        daysDiff: -15,
        amount: 165000000,
        pic: 'Nguyễn Văn A',
        status: 'pending',
        note: 'Đã gửi email nhắc lần 1',
        details: 'Đợt 1 - Tạm ứng (30%)',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        type: 'acceptance_upcoming',
        contractId: contract1Id,
        contractCode: 'HD-2025-001',
        customerName: 'Công ty Cổ phần Cảng Sài Gòn',
        dueDate: '2025-03-10',
        daysDiff: 7,
        amount: 0,
        pic: 'Nguyễn Văn A',
        status: 'processing',
        note: 'Đang chuẩn bị biên bản',
        details: 'Nghiệm thu giai đoạn 1',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        type: 'payment_upcoming',
        contractId: contract2Id,
        contractCode: 'HD-2025-002',
        customerName: 'Tân Cảng Sài Gòn',
        dueDate: '2025-03-15',
        daysDiff: 12,
        amount: 660000000,
        pic: 'Trần Thị B',
        status: 'pending',
        note: '',
        details: 'Đợt 2 - Golive (50%)',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        type: 'acceptance_overdue',
        contractId: contract3Id,
        contractCode: 'HD-2025-003',
        customerName: 'Công ty Cổ phần Cảng Nam Hải',
        dueDate: '2025-01-30',
        daysDiff: -32,
        amount: 0,
        pic: 'Lê Văn C',
        status: 'resolved',
        note: 'Đã ký ngày 02/03',
        details: 'Nghiệm thu tổng thể',
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('warnings', null, {});
    await queryInterface.bulkDelete('project_members', null, {});
    await queryInterface.bulkDelete('expenses', null, {});
    await queryInterface.bulkDelete('payment_terms', null, {});
    await queryInterface.bulkDelete('ContractSoftware', null, {});
    await queryInterface.bulkDelete('Contracts', null, {});
  }
};
