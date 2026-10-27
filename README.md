# ĐỀ THI THỰC HÀNH ĐIỆN TOÁN ĐÁM MÂY - QUẢN LÝ NHÂN SỰ

- **Họ và tên**: Huỳnh Thị Bé Mị
- **Mã số sinh viên**: 237561
- **Lớp**: DH23TIN09

---

## CÂU 5: ĐÓNG GÓI DOCKER & DOCKER HUB

- **Backend Docker Image**: `mih-netizen/backend:latest`
- **Docker Hub Link**: [https://hub.docker.com/r/mih-netizen/backend](https://hub.docker.com/r/mih-netizen/backend)

### Lệnh chạy Docker Container Backend:
```bash
docker run -d -p 5000:5000 \
  -e PORT=5000 \
  -e MONGO_URI="mongodb+srv://mih892970_db_user:mi12345@cluster0.xxxxxx.mongodb.net/237561_HuynhThiBeMi?retryWrites=true&w=majority" \
  mih-netizen/backend:latest
