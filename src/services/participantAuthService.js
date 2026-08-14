// src/services/participantAuthService.js
import api from "./api";

export const participantAuthService = {
    /**
     * POST /api/v1/participant/auth/verify-reset
     * Verifikasi username + hash_id
     */
    verifyReset: (data) => api.post("/participant/auth/verify-reset", data),

    /**
     * POST /api/v1/participant/auth/reset-password
     * Reset password participant (tanpa email)
     */
    resetPassword: (data) => api.post("/participant/auth/reset-password", data),
};