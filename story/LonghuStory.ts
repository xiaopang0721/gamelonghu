/**
* name 牛牛剧情
*/
module gamelonghu.story {
	const enum MAP_STATUS {
        PLAY_STATUS_NONE = 0, // 准备阶段
        PLAY_STATUS_GAMESTART = 1, // 游戏开始
        PLAY_STATUS_PUSH_CARD = 2, // 发牌阶段
        PLAY_STATUS_BET = 3,// 下注阶段
        PLAY_STATUS_STOP_BET = 4,// 停止下注阶段
        PLAY_STATUS_SHOW_CARD = 5, // 开牌阶段
        PLAY_STATUS_SETTLE = 6, // 结算阶段
        PLAY_STATUS_SHOW_INFO = 7, // 显示结算信息阶段
        PLAY_STATUS_RELAX = 8, // 休息阶段
    }
	export class LonghuStory extends gamecomponent.story.StoryBaiRenBase {
		private _longhuMgr: LonghuMgr;
		private _winnerIndex: number;
		private _curStatus: number;
		private _niuMapInfo: LonghuMapInfo;
		private _openCards: Array<any> = [];
		private _isShow: boolean;

		constructor(v: Game, mapid: string, maplv: number) {
			super(v, mapid, maplv);
			this.init();
		}

		get longhuMgr() {
			return this._longhuMgr;
		}

		init() {
			if (!this._longhuMgr) {
				this._longhuMgr = new LonghuMgr(this._game);
			}
			this._game.sceneObjectMgr.on(SceneObjectMgr.EVENT_LOAD_MAP, this, this.onIntoNewMap);
			this._game.sceneObjectMgr.on(SceneObjectMgr.EVENT_MAPINFO_CHANGE, this, this.onMapInfoChange);
			this._game.sceneObjectMgr.on(LonghuMapInfo.EVENT_BATTLE_CHECK, this, this.onUpdateBattle);
			this._game.sceneObjectMgr.on(MapInfo.EVENT_STATUS_CHECK, this, this.onUpdateState);
			
			this.onUpdateBattle();
		}

		private onIntoNewMap(info?: MapAssetInfo): void {
			if (!info) return;
			this.onMapInfoChange();
			this._game.uiRoot.closeAll();
			this._game.uiRoot.HUD.open(LonghuPageDef.PAGE_LONGHU_MAP);
		}

		private onMapInfoChange(): void {
			let mapinfo = this._game.sceneObjectMgr.mapInfo;
			this._niuMapInfo = mapinfo as LonghuMapInfo;
			if (mapinfo) {
				this.onUpdateState();
				this.onUpdateBattle();
			}
		}

		private onUpdateState(): void {
			if (!this._niuMapInfo) return;
			let mapStatus = this._niuMapInfo.GetMapState();
			if (this._curStatus == mapStatus) return;
			this._curStatus = mapStatus;
			switch (this._curStatus) {
				case MAP_STATUS.PLAY_STATUS_NONE:// 准备阶段
					this.serverClose();
					break;
				case MAP_STATUS.PLAY_STATUS_GAMESTART:// 游戏开始

					break;
				case MAP_STATUS.PLAY_STATUS_PUSH_CARD:// 发牌阶段
					this.cardsDeal();
					break;
				case MAP_STATUS.PLAY_STATUS_BET:// 下注阶段
					this.cardsReDeal();
					break;
				case MAP_STATUS.PLAY_STATUS_STOP_BET:// 停止下注阶段
					this._longhuMgr.isReConnect = false;
					break;
				case MAP_STATUS.PLAY_STATUS_SHOW_CARD:// 开牌阶段
					this.cardsReDeal();
					break;
				case MAP_STATUS.PLAY_STATUS_SETTLE:// 结算阶段
					this.cardsReDeal();
					break;
				case MAP_STATUS.PLAY_STATUS_SHOW_INFO:// 显示结算信息阶段
					this.cardsReDeal();
					break;
				case MAP_STATUS.PLAY_STATUS_RELAX:// 休息阶段
					this._isShow = false;
					this._openCards = [];
					break;
			}
		}

		createObj() {
			let card = this._game.sceneObjectMgr.createOfflineObject(SceneRoot.CARD_MARK, LonghuData) as LonghuData;
			card.pos = new Vector2(850, 175);
			return card;
		}

		//正常游戏发牌
		private cardsDeal(): void {
			if (!this._niuMapInfo) return;
			if (this._longhuMgr.allCards.length) return;
			let cards = [0, 0, 0];
			let handle = new Handler(this, this.createObj);
			this._longhuMgr.Init(cards, handle);
			this._longhuMgr.sort();
			this._longhuMgr.fapai();
		}

		//断线重连,重发下牌
		private cardsReDeal(): void {
			if (!this._niuMapInfo) return;
			if (this._longhuMgr.allCards.length) return;
			let cards = [0, 0, 0];
			let handle = new Handler(this, this.createObj);
			this._longhuMgr.Init(cards, handle);
			this._longhuMgr.sort();
			this._longhuMgr.refapai();
			// if (status <= LonghuStory.PLAY_STATUS_SHOW_CARD) {
			// 	this._longhuMgr.isReConnect = false;
			// }
			// this._longhuMgr.event(LonghuMgr.DEAL_OVER);
		}

		//战斗结构体 出牌
		private _index: number = 0;
		private onUpdateBattle(): void {
			if (!this._niuMapInfo) return;
			let battleInfoMgr = this._niuMapInfo.battleInfoMgr;
			for (let i: number = 0; i < battleInfoMgr.info.length; i++) {
				let info = battleInfoMgr.info[i];
				if (info instanceof gamecomponent.object.BattleInfoDeal) {
					let arr = this._longhuMgr.initCard(info.Cards).concat();
					if (this._openCards.length < 2) {
						this._openCards = this._openCards.concat(arr)
					}
				}
			}
			if (this._longhuMgr.isReConnect && this._curStatus >= MAP_STATUS.PLAY_STATUS_SHOW_CARD) {
				if (this._openCards && this._openCards.length > 0) {
					for (let i = 0; i < this._openCards.length; i++) {
						this._longhuMgr.setValue(this._openCards[i], i);
					}
					if (!this._isShow) {
						if (this._longhuMgr) {
							this._longhuMgr.event(LonghuMgr.SHOW_OVER);
						}
						this._isShow = true;
					}
				}
			} else {
				if (this._openCards && this._openCards.length > 0) {
					for (let i = 0; i < this._openCards.length; i++) {
						Laya.timer.once(1800 + 1500 * i, this, () => {
							if (this._longhuMgr) {
								this._longhuMgr.setValue(this._openCards[i], i);
							}
						})
					}
					if (!this._isShow) {
						Laya.timer.once(4500, this, () => {
							if (this._longhuMgr) {
								this._longhuMgr.event(LonghuMgr.SHOW_OVER);
							}
							this._isShow = true;
						})
					}
				}
			}
		}

		enterMap() {
			//各种判断
			this._game.network.call_match_game(this._mapid, this.maplv);
			return true;
		}

		leavelMap() {
			//各种判断
			this._game.network.call_leave_game();
			return true;
		}

		clear() {
			this._game.sceneObjectMgr.off(SceneObjectMgr.EVENT_LOAD_MAP, this, this.onIntoNewMap);
			this._game.sceneObjectMgr.off(SceneObjectMgr.EVENT_MAPINFO_CHANGE, this, this.onMapInfoChange);
			this._game.sceneObjectMgr.off(LonghuMapInfo.EVENT_BATTLE_CHECK, this, this.onUpdateBattle);
			this._game.sceneObjectMgr.off(MapInfo.EVENT_STATUS_CHECK, this, this.onUpdateState);
			if (this._longhuMgr) {
				this._longhuMgr.clear();
				this._longhuMgr = null;
			}
			this._niuMapInfo = null;
		}

		update(diff: number) {

		}
	}
}