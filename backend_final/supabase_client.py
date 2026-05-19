from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()


supabase: Client | None = None


def get_supabase_client() -> Client:
    global supabase
    if supabase is None:
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
        if not supabase_url or not supabase_key:
            raise RuntimeError("Supabase configuration missing: SUPABASE_URL or SUPABASE_SERVICE_KEY")
        supabase = create_client(supabase_url, supabase_key)
    return supabase


def get_user_profile(user_id: str):
    if not user_id:
        return None
    try:
        client = get_supabase_client()
        response = (
            client.table("user_profiles")
            .select("*")
            .eq("id", user_id)
            .maybe_single()
            .execute()
        )
        return response.data
    except Exception:
        return None


def upsert_user_profile(profile: dict):
    client = get_supabase_client()
    return client.table("user_profiles").upsert(profile, on_conflict="id").execute()
