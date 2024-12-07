// utils/format.js

/**
 * Format currency to VND
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount with VND
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };
  
  /**
   * Format date to local string
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted date
   */
  export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  /**
   * Format phone number
   * @param {string} phone - Phone number to format
   * @returns {string} Formatted phone number
   */
  export const formatPhone = (phone) => {
    if (!phone) return '';
    // Remove non-digits
    const cleaned = phone.replace(/\D/g, '');
    // Format as XXX XXX XXXX
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  };
  
  /**
   * Truncate text with ellipsis
   * @param {string} text - Text to truncate
   * @param {number} length - Max length before truncating
   * @returns {string} Truncated text
   */
  export const truncateText = (text, length = 100) => {
    if (!text || text.length <= length) return text;
    return text.slice(0, length) + '...';
  };
  
  /**
   * Format file size
   * @param {number} bytes - Size in bytes
   * @returns {string} Formatted size
   */
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  /**
   * Format percentage
   * @param {number} value - Value to format as percentage
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted percentage
   */
  export const formatPercentage = (value, decimals = 0) => {
    return `${Number(value).toFixed(decimals)}%`;
  };
  
  /**
   * Format address
   * @param {Object} address - Address object
   * @returns {string} Formatted address
   */
  export const formatAddress = (address) => {
    const parts = [
      address.address,
      address.city,
      address.province,
      address.postalCode
    ];
    return parts.filter(Boolean).join(', ');
  };
  
  /**
   * Format order status
   * @param {string} status - Status to format
   * @returns {string} Formatted status in Vietnamese
   */
  export const formatOrderStatus = (status) => {
    const statusMap = {
      'pending': 'Chờ xác nhận',
      'confirmed': 'Đã xác nhận',
      'shipping': 'Đang giao hàng',
      'delivered': 'Đã giao hàng',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
  };
  
  /**
   * Format number with thousand separators
   * @param {number} number - Number to format
   * @returns {string} Formatted number
   */
  export const formatNumber = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };