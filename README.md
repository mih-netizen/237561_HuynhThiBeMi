# ĐỀ THI THỰC HÀNH ĐIỆN TOÁN ĐÁM MÂY - QUẢN LÝ NHÂN SỰ

- **Họ và tên**: Huỳnh Thị Bé Mị
- **Mã số sinh viên**: 237561
- **Lớp**: DH23TIN09

---

## CÂU 5: ĐÓNG GÓI BACKEND BẰNG DOCKER & DOCKER HUB

- **Docker Hub Repository**: [https://hub.docker.com/r/bemi2608/237561huynhthibemi](https://hub.docker.com/r/bemi2608/237561huynhthibemi)
- **Backend Docker Image**: `bemi2608/237561huynhthibemi:latest`

### Lệnh Build & Push Image Backend:
```bash
docker build -t bemi2608/237561huynhthibemi:latest ./backend
docker push bemi2608/237561huynhthibemi:latest
docker run -d -p 5000:5000 \
  -e PORT=5000 \
  -e MONGO_URI="mongodb+srv://mih892970_db_user:mi12345@cluster0.xxxxxx.mongodb.net/237561_HuynhThiBeMi?retryWrites=true&w=majority" \
  bemi2608/237561huynhthibemi:latest
