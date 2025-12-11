'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Seed Customers
    await queryInterface.bulkInsert('master_data_customers', [
      { id: uuidv4(), code: 'KH001', name: 'Công ty Cổ phần Cảng Sài Gòn', field: 'Cảng biển', contactPerson: 'Ông Nguyễn Văn A', phone: '0901234567', email: 'a.nguyen@csg.com', address: 'TP.HCM', taxCode: '0301111111', group: 'VIP', status: 'active', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'KH002', name: 'Công ty TNHH MTV DV Hàng hải Hậu Giang', field: 'Hàng hải', contactPerson: 'Bà Lê Thị B', phone: '0902222222', email: 'b.le@hgl.com', address: 'Hậu Giang', taxCode: '0302222222', group: 'Thân thiết', status: 'active', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'KH003', name: 'Công ty CP Giải pháp CNTT Tân Cảng', field: 'CNTT', contactPerson: 'Ông Trần Văn C', phone: '0903333333', email: 'c.tran@tcl.com', address: 'TP.Thủ Đức', taxCode: '0303333333', group: 'Nội bộ', status: 'active', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'KH004', name: 'Công ty TNHH Cảng Quốc tế Tân Cảng - Cái Mép', field: 'Cảng biển', contactPerson: 'Bà Phạm Thị D', phone: '0904444444', email: 'd.pham@tcit.com', address: 'Bà Rịa - Vũng Tàu', taxCode: '0304444444', group: 'VIP', status: 'active', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'KH005', name: 'Công ty CP Vận tải và Thương mại Quốc tế', field: 'Vận tải', contactPerson: 'Ông Hoàng Văn E', phone: '0905555555', email: 'e.hoang@itc.com', address: 'TP.HCM', taxCode: '0305555555', group: 'Mới', status: 'inactive', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'KH006', name: 'Công ty TNHH Xuất nhập khẩu Sang Trọng', field: 'XNK', contactPerson: 'Bà Ngô Thị F', phone: '0906666666', email: 'f.ngo@sangtrong.com', address: 'Bình Dương', taxCode: '0306666666', group: 'Thường', status: 'active', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'KH007', name: 'Công ty Cổ phần Dịch vụ Hàng hải Tân Cảng', field: 'Hàng hải', contactPerson: 'Ông Đỗ Văn G', phone: '0907777777', email: 'g.do@tcco.com', address: 'TP.Thủ Đức', taxCode: '0307777777', group: 'Nội bộ', status: 'active', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'KH008', name: 'Công ty Cổ phần Cảng Nam Hải', field: 'Cảng biển', contactPerson: 'Bà Vũ Thị H', phone: '0908888888', email: 'h.vu@namhai.com', address: 'Hải Phòng', taxCode: '0308888888', group: 'VIP', status: 'active', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'KH009', name: 'Công ty TNHH MTV Tổng Công ty Tân Cảng Sài Gòn', field: 'Cảng biển', contactPerson: 'Ông Lý Văn I', phone: '0909999999', email: 'i.ly@snp.com', address: 'TP.HCM', taxCode: '0309999999', group: 'VIP', status: 'active', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'KH010', name: 'Công ty TNHH Cảng Phước Long', field: 'Cảng biển', contactPerson: 'Bà Bùi Thị K', phone: '0910000000', email: 'k.bui@phuoclong.com', address: 'TP.Thủ Đức', taxCode: '0310000000', group: 'Thân thiết', status: 'active', createdAt: now, updatedAt: now }
    ], {});

    // Seed Suppliers
    await queryInterface.bulkInsert('master_data_suppliers', [
      { id: uuidv4(), code: 'NCC001', name: 'Công ty TNHH Viễn Thông A', field: 'Hạ tầng mạng', taxCode: '0312223331', contactPerson: 'Nguyễn Văn Minh', phone: '0987654321', email: 'minh.nv@vienthonga.com', address: 'TP.HCM', status: 'active', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'NCC002', name: 'Công ty CP Phần Mềm FPT', field: 'Phần mềm', taxCode: '0312223332', contactPerson: 'Lê Thị Hà', phone: '0912345678', email: 'ha.le@fsoft.com.vn', address: 'Hà Nội', status: 'active', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'NCC003', name: 'Công ty TNHH Máy Tính CMC', field: 'Thiết bị IT', taxCode: '0312223333', contactPerson: 'Trần Văn Tú', phone: '0909090909', email: 'tu.tv@cmc.com', address: 'Đà Nẵng', status: 'inactive', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'NCC004', name: 'Công ty TNHH Dịch vụ Bảo vệ Long Hải', field: 'An ninh', taxCode: '0312223334', contactPerson: 'Phạm Thị Lan', phone: '0933333333', email: 'lan.pt@longhai.com', address: 'Bình Dương', status: 'active', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'NCC005', name: 'Công ty TNHH Vệ sinh Công nghiệp Hoàn Mỹ', field: 'Vệ sinh', taxCode: '0312223335', contactPerson: 'Hoàng Văn Nam', phone: '0944444444', email: 'nam.hv@hoanmy.com', address: 'Đồng Nai', status: 'active', createdAt: now, updatedAt: now }
    ], {});

    // Seed Software Types
    await queryInterface.bulkInsert('master_data_software', [
      { id: uuidv4(), code: 'PM01', name: 'VTOS', description: 'Vietnam Terminal Operating System', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'PM02', name: 'VSL', description: 'Vessel Planning System', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'PM03', name: 'CAS', description: 'Container Automation System', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'PM04', name: 'ECM', description: 'Empty Container Management', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'PM05', name: 'M&R', description: 'Maintenance and Repair', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'PM06', name: 'Smartport', description: 'Smart Port Application', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'PM07', name: 'GTOS', description: 'General Cargo Terminal Operating System', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'PM08', name: 'Eport', description: 'Electronic Port', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'PM09', name: 'TAS', description: 'Terminal Automation System', createdAt: now, updatedAt: now }
    ], {});

    // Seed Status
    await queryInterface.bulkInsert('master_data_status', [
      { id: uuidv4(), code: 'ST01', name: 'Chưa thực hiện', description: 'Mới ký, chưa start', color: 'bg-slate-100 text-slate-600', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'ST02', name: 'Đang triển khai', description: 'Dự án đang chạy', color: 'bg-blue-100 text-blue-600', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'ST03', name: 'Hoàn thành', description: 'Đã nghiệm thu', color: 'bg-emerald-100 text-emerald-600', createdAt: now, updatedAt: now }
    ], {});

    // Seed Contract Types
    await queryInterface.bulkInsert('master_data_contract_types', [
      { id: uuidv4(), code: 'HD01', name: 'Triển khai mới', description: 'Hợp đồng dự án mới', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'HD02', name: 'Bảo trì', description: 'Hợp đồng bảo trì, hỗ trợ', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'HD03', name: 'Gia hạn', description: 'Phụ lục gia hạn thời gian', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'HD04', name: 'Mua sắm', description: 'Mua sắm thiết bị, bản quyền', createdAt: now, updatedAt: now }
    ], {});

    // Seed Units
    await queryInterface.bulkInsert('master_data_units', [
      { id: uuidv4(), code: 'DV01', name: 'CEH Software', description: 'Khối phát triển phần mềm', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'DV02', name: 'CEH Infrastructure', description: 'Khối hạ tầng mạng', createdAt: now, updatedAt: now },
      { id: uuidv4(), code: 'DV03', name: 'CEH Consulting', description: 'Khối tư vấn giải pháp', createdAt: now, updatedAt: now }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('master_data_units', null, {});
    await queryInterface.bulkDelete('master_data_contract_types', null, {});
    await queryInterface.bulkDelete('master_data_status', null, {});
    await queryInterface.bulkDelete('master_data_software', null, {});
    await queryInterface.bulkDelete('master_data_suppliers', null, {});
    await queryInterface.bulkDelete('master_data_customers', null, {});
  }
};
