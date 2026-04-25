import UserAiSession from "../../models/ai/userAiSession.js";

export const listSessions = async (req, res) => {
  try {
    const sessions = await UserAiSession.find({ userId: req.user.userId })
      .select("sessionId title updatedAt")
      .sort({ updatedAt: -1 })
      .limit(50);
    return res.json({ success: true, sessions });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to load sessions" });
  }
};

export const getSession = async (req, res) => {
  try {
    const session = await UserAiSession.findOne({
      userId: req.user.userId,
      sessionId: req.params.sessionId,
    });
    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    return res.json({ success: true, session });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to load session" });
  }
};

export const deleteSession = async (req, res) => {
  try {
    await UserAiSession.deleteOne({
      userId: req.user.userId,
      sessionId: req.params.sessionId,
    });
    return res.json({ success: true });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete session" });
  }
};

// Called after login to migrate guest localStorage session into DB
export const syncGuestSession = async (req, res) => {
  try {
    const { sessionId, messages, knownContent, title } = req.body;
    if (!sessionId || !Array.isArray(messages) || messages.length === 0) {
      return res.json({ success: true, skipped: true });
    }

    const derivedTitle = (
      title ||
      messages.find((m) => m.role === "user")?.content ||
      "Invoice"
    ).slice(0, 60);

    await UserAiSession.findOneAndUpdate(
      { userId: req.user.userId, sessionId },
      {
        $setOnInsert: {
          userId: req.user.userId,
          sessionId,
          title: derivedTitle,
          messages,
          knownContent: knownContent || {},
          lastAction: "generate",
        },
      },
      { upsert: true, new: true },
    );

    return res.json({ success: true });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to sync session" });
  }
};
