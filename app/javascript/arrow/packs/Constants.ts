const Constants = {
  initialHp: 500,

  chargeMax: 0.5,
  energyMax: 100,

  healIntervalTimeSeconds: 0.17,
  healAmountPerEvent: 2,
  addEnergyAmountPerEvent: 3,
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

  // 1秒あたりのかすりダメージ量
  shaveDamageRate: 60,
  // 1秒あたりのヒットダメージ量
  hitDamageRate: 4500,

  initialBallCount: 20,
  spawnBallIntervalTimeSeconds: 1,
  maxBallVelocityX: 0.24,
  maxBallVelocityY: 0.48,

  // 非常に残念ながら constants.scss と相互依存してしまっているところ
  gameWindowPixelSizeX : 600.0,
  gameWindowPixelSizeY : 600.0,
};
export default Constants;
