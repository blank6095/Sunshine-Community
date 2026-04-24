export const validateUsername = (username) => {
  if (!username) return '用户名不能为空';
  if (username.length < 3) return '用户名至少3个字符';
  if (username.length > 20) return '用户名最多20个字符';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return '密码不能为空';
  if (password.length < 6) return '密码至少6个字符';
  return null;
};

export const validateName = (name) => {
  if (!name) return '姓名不能为空';
  if (name.length < 2) return '姓名至少2个字符';
  if (name.length > 30) return '姓名最多30个字符';
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return '手机号不能为空';
  if (!/^1[3-9]\d{9}$/.test(phone)) return '请输入有效的手机号';
  return null;
};

export const validateAge = (age) => {
  if (!age && age !== 0) return '年龄不能为空';
  const numAge = parseInt(age, 10);
  if (isNaN(numAge)) return '年龄必须是数字';
  if (numAge < 1 || numAge > 150) return '年龄必须在1-150之间';
  return null;
};

export const validateEmail = (email) => {
  if (!email) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '请输入有效的邮箱地址';
  return null;
};

export const validateIdCard = (idCard) => {
  if (!idCard) return null;
  if (!/^\d{17}[\dXx]$/.test(idCard)) return '请输入有效的身份证号';
  return null;
};

export const validateDepartmentName = (name) => {
  if (!name) return '科室名称不能为空';
  if (name.length < 2) return '科室名称至少2个字符';
  if (name.length > 30) return '科室名称最多30个字符';
  return null;
};

export const validateTitle = (title) => {
  if (!title) return '职称不能为空';
  if (title.length < 1) return '职称不能为空';
  if (title.length > 20) return '职称最多20个字符';
  return null;
};

export const validateMaxPatients = (maxPatients) => {
  if (!maxPatients && maxPatients !== 0) return '最大预约人数不能为空';
  const num = parseInt(maxPatients, 10);
  if (isNaN(num)) return '最大预约人数必须是数字';
  if (num < 1) return '最大预约人数至少为1';
  if (num > 200) return '最大预约人数不能超过200';
  return null;
};

export const validateTime = (startTime, endTime) => {
  if (!startTime) return '开始时间不能为空';
  if (!endTime) return '结束时间不能为空';
  if (startTime >= endTime) return '结束时间必须晚于开始时间';
  return null;
};

export const validateDate = (date) => {
  if (!date) return '日期不能为空';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(date);
  if (selectedDate < today) return '日期不能早于今天';
  return null;
};
