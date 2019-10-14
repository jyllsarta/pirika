const Constants = {
  initialHp: 500,

  // 最大チャージに必要な秒数
  chargeMax: 0.15,
  energyMax: 100,

  healIntervalTimeSeconds: 0.17,
  healAmountPerEvent: 2,
  addEnergyAmountPerEvent: 3,

  // 必殺技の有効半径
  dischargeRadius: 0.17,
  // 必殺技で一つ巻き込むごとにどれだけHPを回復するか
  dischargeRemoveHealPoint: 10,

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
  hitDamageRate: 3000,

  initialBallCount: 20,
  // seconds 秒 経過後は interval 秒ごとに弾を追加する
  spawnBallIntervalTimes: [
    //[seconds, interval]
    [ 0, 1.0],
    [20, 0.8],
    [40, 0.7],
    [55, 0.6],
    [80, 0.5],
    [99, 0.4],
  ],
  maxBallVelocityX: 0.50,
  maxBallVelocityY: 0.75,

  // 非常に残念ながら constants.scss と相互依存してしまっているところ
  gameWindowPixelSizeX : 600.0,
  gameWindowPixelSizeY : 600.0,
  colorIdNum: 3,
};
export default Constants;
