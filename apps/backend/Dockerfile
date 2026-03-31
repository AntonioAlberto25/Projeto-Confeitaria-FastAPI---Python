# Stage 1: deps — instala dependências Python
FROM python:3.12-slim AS deps
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Stage 2: runtime — imagem final mínima
FROM python:3.12-slim AS runtime
RUN addgroup --system appgroup \
    && adduser --system --ingroup appgroup appuser
WORKDIR /app
COPY --from=deps /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=deps /usr/local/bin /usr/local/bin
COPY --chown=appuser:appgroup src/ ./src/
USER appuser
EXPOSE ${PORT:-8000}
CMD ["sh", "-c", "uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
