const {
  Contract,
  MasterDataCustomer,
  MasterDataStatus,
  MasterDataContractType,
  MasterDataSoftware,
  PaymentTerm,
  Expense,
  ProjectMember,
  ContractAttachment,
  MasterDataSupplier,
  User
} = require('../models');
const { logAction } = require('../utils/logger');

// @desc    Get all contracts
// @route   GET /api/contracts
// @access  Private
exports.getContracts = async (req, res) => {
  try {
    const contracts = await Contract.findAll({
      include: [
        { model: MasterDataCustomer, as: 'customer', attributes: ['id', 'code', 'name'] },
        { model: MasterDataStatus, as: 'status', attributes: ['id', 'code', 'name', 'color'] },
        { model: MasterDataContractType, as: 'contractType', attributes: ['id', 'code', 'name'] },
        { model: MasterDataSoftware, as: 'softwareTypes', attributes: ['id', 'code', 'name'], through: { attributes: [] } },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: contracts.length,
      data: contracts
    });
  } catch(err) {
    res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
  }
};

// @desc    Get single contract with all details
// @route   GET /api/contracts/:id
// @access  Private
exports.getContract = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id, {
      include: [
        { model: MasterDataCustomer, as: 'customer' },
        { model: MasterDataStatus, as: 'status' },
        { model: MasterDataContractType, as: 'contractType' },
        { model: MasterDataSoftware, as: 'softwareTypes', through: { attributes: [] } },
        { model: PaymentTerm, as: 'paymentTerms' },
        {
          model: Expense,
          as: 'expenses',
          include: [{ model: MasterDataSupplier, as: 'supplier', attributes: ['id', 'code', 'name'] }]
        },
        { model: ProjectMember, as: 'members' },
        { model: ContractAttachment, as: 'attachments' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ]
    });

    if(!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    res.status(200).json({
      success: true,
      data: contract
    });
  } catch(err) {
    res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
  }
};

// @desc    Create new contract
// @route   POST /api/contracts
// @access  Private
exports.createContract = async (req, res) => {
  try {
    // Extract software IDs and other nested data
    const { softwareIds, paymentTerms, expenses, members, attachments, ...contractData } = req.body;

    // Add logged-in user's id
    contractData.userId = req.user.id;

    // Create contract
    const contract = await Contract.create(contractData);

    // Associate software types if provided
    if(softwareIds && softwareIds.length > 0) {
      await contract.setSoftwareTypes(softwareIds);
    }

    // Create payment terms if provided
    if(paymentTerms && paymentTerms.length > 0) {
      await PaymentTerm.bulkCreate(
        paymentTerms.map(pt => ({ ...pt, contractId: contract.id }))
      );
    }

    // Create expenses if provided
    if(expenses && expenses.length > 0) {
      await Expense.bulkCreate(
        expenses.map(exp => ({ ...exp, contractId: contract.id }))
      );
    }

    // Create members if provided
    if(members && members.length > 0) {
      await ProjectMember.bulkCreate(
        members.map(member => ({ ...member, contractId: contract.id }))
      );
    }

    // Create attachments if provided
    if(attachments && attachments.length > 0) {
      await ContractAttachment.bulkCreate(
        attachments.map(att => ({ ...att, contractId: contract.id }))
      );
    }

    // Fetch complete contract with all associations
    const completeContract = await Contract.findByPk(contract.id, {
      include: [
        { model: MasterDataCustomer, as: 'customer' },
        { model: MasterDataStatus, as: 'status' },
        { model: MasterDataContractType, as: 'contractType' },
        { model: MasterDataSoftware, as: 'softwareTypes', through: { attributes: [] } },
        { model: PaymentTerm, as: 'paymentTerms' },
        { model: Expense, as: 'expenses' },
        { model: ProjectMember, as: 'members' },
        { model: ContractAttachment, as: 'attachments' }
      ]
    });

    await logAction({
      userId: req.user.id,
      screen: 'CONTRACT',
      action: 'CREATE',
      details: { contractId: contract.id, code: contractData.code },
      req
    });

    res.status(201).json({
      success: true,
      data: completeContract
    });
  } catch(err) {
    if(err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      const messages = err.errors.map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
  }
};

// @desc    Update contract
// @route   PUT /api/contracts/:id
// @access  Private
exports.updateContract = async (req, res) => {
  try {
    let contract = await Contract.findByPk(req.params.id);

    if(!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    const { softwareIds, paymentTerms, expenses, members, ...contractData } = req.body;

    // Update contract basic fields
    contract = await contract.update(contractData);

    // Update software associations if provided
    if(softwareIds) {
      await contract.setSoftwareTypes(softwareIds);
    }

    // --- Sync Nested Associations ---

    // 1. Sync Payment Terms
    if(paymentTerms) {
      // Get existing IDs from DB
      const existingTerms = await PaymentTerm.findAll({ where: { contractId: contract.id }, attributes: ['id'] });
      const existingIds = existingTerms.map(t => t.id);

      // Separate input into create, update, delete
      const incomingIds = paymentTerms.filter(t => t.id && !t.id.toString().startsWith('term_')).map(t => t.id);
      const toDelete = existingIds.filter(id => !incomingIds.includes(id));
      const toUpdate = paymentTerms.filter(t => t.id && !t.id.toString().startsWith('term_') && existingIds.includes(t.id));
      const toCreate = paymentTerms.filter(t => !t.id || t.id.toString().startsWith('term_'));

      // Execute Sync
      if(toDelete.length > 0) await PaymentTerm.destroy({ where: { id: toDelete } });
      for(const term of toUpdate) await PaymentTerm.update(term, { where: { id: term.id } });
      for(const term of toCreate) await PaymentTerm.create({ ...term, id: undefined, contractId: contract.id });
    }

    // 2. Sync Expenses
    if(expenses) {
      const existingExpenses = await Expense.findAll({ where: { contractId: contract.id }, attributes: ['id'] });
      const existingIds = existingExpenses.map(e => e.id);

      const incomingIds = expenses.filter(e => e.id && !e.id.toString().startsWith('exp_')).map(e => e.id);
      const toDelete = existingIds.filter(id => !incomingIds.includes(id));
      const toUpdate = expenses.filter(e => e.id && !e.id.toString().startsWith('exp_') && existingIds.includes(e.id));
      const toCreate = expenses.filter(e => !e.id || e.id.toString().startsWith('exp_'));

      if(toDelete.length > 0) await Expense.destroy({ where: { id: toDelete } });
      for(const exp of toUpdate) await Expense.update(exp, { where: { id: exp.id } });
      for(const exp of toCreate) await Expense.create({ ...exp, id: undefined, contractId: contract.id });
    }

    // 3. Sync Project Members
    if(members) {
      const existingMembers = await ProjectMember.findAll({ where: { contractId: contract.id }, attributes: ['id'] });
      const existingIds = existingMembers.map(m => m.id);

      const incomingIds = members.filter(m => m.id && !m.id.toString().startsWith('mem_')).map(m => m.id);
      const toDelete = existingIds.filter(id => !incomingIds.includes(id));
      const toUpdate = members.filter(m => m.id && !m.id.toString().startsWith('mem_') && existingIds.includes(m.id));
      const toCreate = members.filter(m => !m.id || m.id.toString().startsWith('mem_'));

      if(toDelete.length > 0) await ProjectMember.destroy({ where: { id: toDelete } });
      for(const mem of toUpdate) await ProjectMember.update(mem, { where: { id: mem.id } });
      for(const mem of toCreate) await ProjectMember.create({ ...mem, id: undefined, contractId: contract.id });
    }

    // Fetch updated contract with associations
    const updatedContract = await Contract.findByPk(contract.id, {
      include: [
        { model: MasterDataCustomer, as: 'customer' },
        { model: MasterDataStatus, as: 'status' },
        { model: MasterDataContractType, as: 'contractType' },
        { model: MasterDataSoftware, as: 'softwareTypes', through: { attributes: [] } },
        { model: PaymentTerm, as: 'paymentTerms' },
        { model: Expense, as: 'expenses' },
        { model: ProjectMember, as: 'members' },
        { model: ContractAttachment, as: 'attachments' }
      ]
    });

    await logAction({
      userId: req.user.id,
      screen: 'CONTRACT',
      action: 'UPDATE',
      details: { contractId: contract.id, code: contract.code },
      req
    });

    res.status(200).json({
      success: true,
      data: updatedContract
    });
  } catch(err) {
    if(err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      const messages = err.errors.map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
  }
};

// @desc    Delete contract
// @route   DELETE /api/contracts/:id
// @access  Private
exports.deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);

    if(!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    await contract.destroy();

    await logAction({
      userId: req.user.id,
      screen: 'CONTRACT',
      action: 'DELETE',
      details: { contractId: req.params.id, code: contract.code },
      req
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch(err) {
    res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
  }
};

// @desc    Add payment term to contract
// @route   POST /api/contracts/:id/payment-terms
// @access  Private
exports.addPaymentTerm = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if(!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    const paymentTerm = await PaymentTerm.create({
      ...req.body,
      contractId: contract.id
    });

    res.status(201).json({
      success: true,
      data: paymentTerm
    });
  } catch(err) {
    res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
  }
};

// @desc    Update payment term
// @route   PUT /api/contracts/:id/payment-terms/:termId
// @access  Private
exports.updatePaymentTerm = async (req, res) => {
  try {
    let paymentTerm = await PaymentTerm.findByPk(req.params.termId);
    if(!paymentTerm) {
      return res.status(404).json({ success: false, message: 'Payment term not found' });
    }

    paymentTerm = await paymentTerm.update(req.body);

    res.status(200).json({
      success: true,
      data: paymentTerm
    });
  } catch(err) {
    res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
  }
};

// @desc    Add expense to contract
// @route   POST /api/contracts/:id/expenses
// @access  Private
exports.addExpense = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if(!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    const expense = await Expense.create({
      ...req.body,
      contractId: contract.id
    });

    // Fetch with supplier details
    const expenseWithSupplier = await Expense.findByPk(expense.id, {
      include: [{ model: MasterDataSupplier, as: 'supplier' }]
    });

    res.status(201).json({
      success: true,
      data: expenseWithSupplier
    });
  } catch(err) {
    res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
  }
};

// @desc    Update expense
// @route   PUT /api/contracts/:id/expenses/:expenseId
// @access  Private
exports.updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findByPk(req.params.expenseId);
    if(!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    expense = await expense.update(req.body);

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch(err) {
    res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
  }
};

// @desc    Add member to contract
// @route   POST /api/contracts/:id/members
// @access  Private
exports.addMember = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if(!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    const member = await ProjectMember.create({
      ...req.body,
      contractId: contract.id
    });

    res.status(201).json({
      success: true,
      data: member
    });
  } catch(err) {
    res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
  }
};

// @desc    Delete member from contract
// @route   DELETE /api/contracts/:id/members/:memberId
// @access  Private
exports.deleteMember = async (req, res) => {
  try {
    const member = await ProjectMember.findByPk(req.params.memberId);
    if(!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    await member.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch(err) {
    res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
  }
};
