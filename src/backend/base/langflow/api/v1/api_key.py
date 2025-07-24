from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response

from langflow.api.utils import CurrentActiveUser, DbSession
from langflow.api.v1.schemas import ApiKeyCreateRequest, ApiKeysResponse
from langflow.services.auth import utils as auth_utils

# Assuming you have these methods in your service layer
from langflow.services.database.models.api_key.crud import create_api_key, delete_api_key, get_api_keys
from langflow.services.database.models.api_key.model import ApiKeyCreate, UnmaskedApiKeyRead
from langflow.services.deps import get_settings_service

router = APIRouter(tags=["APIKey"], prefix="/api_key")


@router.get("/")
async def get_api_keys_route(
    db: DbSession,
    current_user: CurrentActiveUser,
) -> ApiKeysResponse:
    try:
        user_id = current_user.id
        keys = await get_api_keys(db, user_id)

        return ApiKeysResponse(total_count=len(keys), user_id=user_id, api_keys=keys)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/")
async def create_api_key_route(
    req: ApiKeyCreate,
    current_user: CurrentActiveUser,
    db: DbSession,
) -> UnmaskedApiKeyRead:
    try:
        user_id = current_user.id
        return await create_api_key(db, req, user_id=user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.delete("/{api_key_id}", dependencies=[Depends(auth_utils.get_current_active_user)])
async def delete_api_key_route(
    api_key_id: UUID,
    db: DbSession,
):
    try:
        await delete_api_key(db, api_key_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    return {"detail": "API Key deleted"}
