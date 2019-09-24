const Constants = {
  initialHp: 500,

  chargeMax: 60,
  energyMax: 100,

  healIntervalFrameCount: 10,
  addEnergyIntervalFrameCount: 10,
  healAmountPerEvent: 2,
  addEnergyAmountPerEvent: 2,
  chargeAmountPerEvent: 1,

  // 必殺技の有効半径
  dischargeRadius: 0.15,

  // minimumHitBoxSizeRate + (HP割合 * ratioOfHpRateToHitBox) が当たり判定拡大率になる
  // 0.5 , 1 なら HP0で当たり判定 0.5倍, MAXで1.5倍サイズ
  minimumHitBoxSizeRate: 0.5,
  ratioOfHpRateToHitBox: 1,

  // かすり判定のサイズ
  shaveDamageRadius: 0.08,
  // ヒット判定のサイズ
  hitDamageRadius: 0.04,

  // かすりダメージ量
  shaveDamageRate: 1,
  // ヒットダメージ量
  hitDamageRate: 75,

  initialBallCount: 20,
  spawnBallIntervalFrameCount: 60,
  maxBallVelocityX: 0.004,
  maxBallVelocityY: 0.008,

  // 非常に残念ながら constants.scss と相互依存してしまっているところ
  gameWindowPixelSizeX : 600.0,
  gameWindowPixelSizeY : 600.0,
};
export default Constants;
