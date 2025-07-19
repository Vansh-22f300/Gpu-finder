const axios = require('axios');
const FormData = require('../model/FormData.js');

const fetchPricing = async (req, res) => {
  try {
    const {
      budget,
      country,
      region,
      os_type,
      ram,
      vcpus,
      is_gpu,
      is_spot,
    } = req.body;

    const url = `${process.env.ACECLOUD_API_BASE}?is_gpu=${is_gpu}&is_spot=${is_spot}&resource=instances&region=${region}`;
    const apiResponse = await axios.get(url);
    const allInstances = apiResponse.data?.data || [];

    const normalizedRegion = region.toLowerCase();
    const normalizedOS = os_type.toLowerCase();
    const topN = 10;

    const topInstances = [];

    for (let i = 0; i < allInstances.length; i++) {
      const instance = allInstances[i];
      const instanceRegion = instance.region?.toLowerCase();
      const instanceOS = instance.operating_system?.toLowerCase();
      const price = instance.price_per_month ?? Infinity;

      let score = 0;

      // Keep your weights as-is
      if (instanceOS === normalizedOS) score += 30;
      if (instanceRegion === normalizedRegion) score += 30;

      if (instance.ram >= ram) {
        score += Math.min(20, ((instance.ram - ram) / ram) * 10);
      }

      if (instance.vcpus >= vcpus) {
        score += Math.min(10, ((instance.vcpus - vcpus) / vcpus) * 5);
      }

      if (price <= budget) {
        score += 10 * (1 - (price / budget));
      } else {
        score -= 20;
      }

      if (score <= 0) continue;

      const scoredInstance = { ...instance, score };

      // Insert scoredInstance into the sorted topInstances array
      let inserted = false;
      for (let j = 0; j < topInstances.length; j++) {
        if (score > topInstances[j].score) {
          topInstances.splice(j, 0, scoredInstance);
          inserted = true;
          break;
        }
      }

      // If not inserted and array is under capacity, push at end
      if (!inserted && topInstances.length < topN) {
        topInstances.push(scoredInstance);
      }

      // If array exceeds limit, remove the lowest scored one
      if (topInstances.length > topN) {
        topInstances.length = topN;
      }
    }

    const formData = new FormData({
      budget,
      country,
      region,
      os_type,
      ram,
      vcpus,
      is_gpu,
      is_spot,
      pricingResponse: allInstances,
      recommendedInstances: topInstances,
    });

    await formData.save();

    return res.status(200).json({
      success: true,
      message: topInstances.length > 0
        ? 'Recommended instances returned successfully'
        : 'No matching instances found',
      data: topInstances,
    });

  } catch (err) {
    console.error('Error fetching pricing:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching pricing',
    });
  }
};

module.exports = { fetchPricing };
