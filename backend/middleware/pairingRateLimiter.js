const failedAttempts = new Map();

/**
 * Cihaz eşleştirme (pair/verify-code) istekleri için rate limiter middleware'i.
 * 15 dakika içinde 5 kez hatalı deneme yapan çocuk kullanıcısını 15 dakika kilitler.
 */
const pairingRateLimiter = (req, res, next) => {
  const userId = req.user ? req.user.id : req.ip; // Auth'lu istekte user.id, yoksa IP bazlı
  const now = Date.now();
  
  if (failedAttempts.has(userId)) {
    const record = failedAttempts.get(userId);
    
    // Kilit süresi dolmuş mu kontrol et
    if (record.lockUntil && now < record.lockUntil) {
      const remainingMinutes = Math.ceil((record.lockUntil - now) / 60000);
      return res.status(429).json({
        message: `Çok fazla hatalı deneme yaptınız. Lütfen ${remainingMinutes} dakika sonra tekrar deneyin.`
      });
    }
    
    // Kilit süresi dolmuşsa kaydı temizle/sıfırla
    if (record.lockUntil && now >= record.lockUntil) {
      failedAttempts.delete(userId);
    }
  }
  
  next();
};

/**
 * Başarısız deneme durumunda sayacı artırır ve gerekirse kilitler.
 */
const recordFailedAttempt = (userId) => {
  const now = Date.now();
  const lockoutTime = 15 * 60 * 1000; // 15 dakika kilit
  const maxAttempts = 5;
  
  let record = failedAttempts.get(userId) || { count: 0, lockUntil: null };
  record.count += 1;
  
  if (record.count >= maxAttempts) {
    record.lockUntil = now + lockoutTime;
  }
  
  failedAttempts.set(userId, record);
  return record;
};

/**
 * Başarılı eşleşme durumunda sayaç kaydını temizler.
 */
const resetFailedAttempts = (userId) => {
  failedAttempts.delete(userId);
};

module.exports = {
  pairingRateLimiter,
  recordFailedAttempt,
  resetFailedAttempts
};
