function validate() {
  const errors = {};
  if (!customer.value.trim()) errors.customer = '顧客名は必須です';
  if (!/^[^@]+@[^@]+$/.test(email.value)) errors.email = 'メール形式で入力してください';
  if (note.value.length > 200) errors.note = '備考は200文字以内です';
  return errors;
}
form.onsubmit = async (event) => {
  event.preventDefault();
  e_customer.textContent = e_email.textContent = e_note.textContent = '';
  const errors = validate();
  if (Object.keys(errors).length) {
    e_customer.textContent = errors.customer || '';
    e_email.textContent = errors.email || '';
    e_note.textContent = errors.note || '';
    return;
  }
  submit.disabled = true;
  out.textContent = '送信中...';
  await new Promise((resolve) => setTimeout(resolve, 400));
  out.textContent = `成功\n顧客名: ${customer.value}\nメール: ${email.value}`;
  submit.disabled = false;
};
