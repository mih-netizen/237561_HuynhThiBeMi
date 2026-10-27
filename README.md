# ĐỀ THI THỰC HÀNH ĐIỆN TOÁN ĐÁM MÂY - QUẢN LÝ NHÂN SỰ

- **Họ và tên**: Huỳnh Thị Bé Mị
- **Mã số sinh viên**: 237561
- **Lớp**: DH23TIN09

---

## CÂU 5: ĐÓNG GÓI DOCKER & DOCKER HUB

- **Backend Docker Image**: `bemi2608/backend:latest`
- **Docker Hub Link**: [https://hub.docker.com/r/bemi2608/backend](https://hub.docker.com/r/bemi2608/backend)

### Lệnh chạy Docker Container Backend:
```bash
docker run -d -p 5000:5000 \
  -e PORT=5000 \
  -e MONGO_URI="mongodb+srv://mih892970_db_user:mi12345@cluster0.xxxxxx.mongodb.net/237561_HuynhThiBeMi?retryWrites=true&w=majority" \
  bemi2608/backend:latest

---

### Đẩy cập nhật cuối cùng lên GitHub

Mở Terminal trong VS Code (`Ctrl + ~`) và chạy 3 lệnh sau để lưu lại thông tin Docker Hub chính xác của bạn:

```cmd
git add README.md
git commit -m "Docs: Update Docker Hub username to bemi2608 in README"
git push origin main
