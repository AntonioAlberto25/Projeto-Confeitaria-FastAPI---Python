from fastapi import APIRouter, Request, HTTPException, status, Depends
from svix.webhooks import Webhook, WebhookVerificationError
import os
from src.presentation.controllers.userController import UserController
from src.infrastructure.dependencies import get_user_controller
from src.presentation.schemas.user_schema import UserCreate

router = APIRouter(prefix="/webhooks/clerk", tags=["webhooks"])

CLERK_WEBHOOK_SECRET = os.getenv("CLERK_WEBHOOK_SECRET")

@router.post("/")
async def clerk_webhook(
    request: Request,
    controller: UserController = Depends(get_user_controller)
):
    """
    Recebe eventos do Clerk (webhooks) e sincroniza o banco local.
    Requer CLERK_WEBHOOK_SECRET configurado para validação com svix.
    """
    if not CLERK_WEBHOOK_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook secret not configured"
        )

    headers = request.headers
    payload = await request.body()
    
    # 1. Validar Assinatura do Clerk (Segurança)
    try:
        wh = Webhook(CLERK_WEBHOOK_SECRET)
        data = wh.verify(payload.decode(), headers)
    except WebhookVerificationError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid signature"
        )
    
    # 2. Processar Eventos
    event_type = data.get("type")
    event_data = data.get("data", {})

    if event_type in ["user.created", "user.updated"]:
        # Mapear dados do Clerk p/ nosso DTO
        # Clerk envia email_addresses como lista
        emails = event_data.get("email_addresses", [])
        primary_email = emails[0].get("email_address") if emails else ""
        
        user_dto = UserCreate(
            id=event_data.get("id"),
            email=primary_email,
            first_name=event_data.get("first_name") or "",
            last_name=event_data.get("last_name") or "",
            role="Confeiteiro" # Default
        )
        controller.registrar_novo_usuario_clerk(user_dto)
        return {"status": "success", "event": event_type}

    elif event_type == "user.deleted":
        # Implementar lógica de delete se necessário no Controller
        return {"status": "success", "event": "user.deleted (ignorado por agora)"}

    return {"status": "ignored", "event": event_type}
