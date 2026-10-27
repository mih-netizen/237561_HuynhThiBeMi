# ĐỀ THI THỰC HÀNH ĐIỆN TOÁN ĐÁM MÂY - QUẢN LÝ NHÂN SỰ

- **Họ và tên**: Huỳnh Thị Bé Mị
- **Mã số sinh viên**: 237561
- **Lớp**: DH23TIN09

---

## DOCKER HUB REPOSITORIES

- **Trang Repositories tổng**: [https://hub.docker.com/repositories/bemi2608](https://hub.docker.com/repositories/bemi2608)
- **Backend Docker Repository**: [https://hub.docker.com/r/bemi2608/237561huynhthibemi](https://hub.docker.com/r/bemi2608/237561huynhthibemi)
- **Frontend Docker Repository**: [https://hub.docker.com/r/bemi2608/237561huynhthibemi-frontend](https://hub.docker.com/r/bemi2608/237561huynhthibemi-frontend)
- **Render Frontend Web App ** | [https://web-237561.onrender.com](https://web-237561.onrender.com) |
---

## 1. CÂU 5: ĐÓNG GÓI BACKEND
- **Image**: `bemi2608/237561huynhthibemi:latest`
```bash
docker build -t bemi2608/237561huynhthibemi:latest ./backend
docker push bemi2608/237561huynhthibemi:latest
docker run -d -p 5000:5000 -e PORT=5000 -e MONGO_URI="mongodb+srv://mih892970_db_user:mi12345@cluster0.xxxxxx.mongodb.net/237561_HuynhThiBeMi?retryWrites=true&w=majority" bemi2608/237561huynhthibemi:latest
