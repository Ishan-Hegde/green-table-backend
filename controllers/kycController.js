const KYC = require('../models/KYC');
const User = require('../models/User');

// Submit KYC
exports.submitKYC = async (req, res) => {
    try {
        const { userId, restaurantName, ownerName, address, licenseNumber, documents } = req.body;

        const existingKYC = await KYC.findOne({ userId });

        if (existingKYC) {
            return res.status(400).json({ message: 'KYC already submitted' });
        }

        const kyc = await KYC.create({ userId, restaurantName, ownerName, address, licenseNumber, documents });

        res.status(201).json({ message: 'KYC submitted successfully', kyc });
    } catch (error) {
        res.status(500).json({ message: 'KYC submission failed', error });
    }
};

// Approve or Reject KYC
exports.approveKYC = async (req, res) => {
    try {
        const { kycId, status } = req.body;

        const kyc = await KYC.findById(kycId);
        if (!kyc) return res.status(404).json({ message: 'KYC not found' });

        kyc.status = status;
        await kyc.save();

        if (status === 'approved') {
            await User.findByIdAndUpdate(kyc.userId, { kycCompleted: true });
        }

        res.json({ message: `KYC ${status}`, kyc });
    } catch (error) {
        res.status(500).json({ message: 'Error updating KYC status', error });
    }
};
