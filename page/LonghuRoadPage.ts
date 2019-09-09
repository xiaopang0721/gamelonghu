/**
* name 
*/
module gamelonghu.page {
	export class LonghuRoadPage extends game.gui.base.Page {
		private _viewUI: ui.nqp.game_ui.longhu.ZouShiTuUI;
		private _isShenQing: boolean = false;
		private _mapinfo: LonghuMapInfo;
		private _gridEditor: GridEditor;

		constructor(v: Game, onOpenFunc?: Function, onCloseFunc?: Function) {
			super(v, onOpenFunc, onCloseFunc);
			this._isNeedBlack = true;
			this._isClickBlack = true;
			this._isNeedDuang = false;
			this._asset = [
				PathGameTongyong.atlas_game_ui_tongyong+ "general.atlas",
				Path_game_longhu.atlas_game_ui + "longhu.atlas",
			];
		}

		protected init(): void {
			this._viewUI = this.createView('game_ui.longhu.ZouShiTuUI');
			this.addChild(this._viewUI);
			
			let textureTypes = {
				"L": PathGameTongyong.ui_tongyong_general + "tu_lq.png",//龙
				"H": PathGameTongyong.ui_tongyong_general + "tu_yq0.png",//虎
				"1": PathGameTongyong.ui_tongyong_general + "plsz_1.png",//和数量
				"2": PathGameTongyong.ui_tongyong_general + "plsz_2.png",
				"3": PathGameTongyong.ui_tongyong_general + "plsz_3.png",
				"4": PathGameTongyong.ui_tongyong_general + "plsz_4.png",
				"5": PathGameTongyong.ui_tongyong_general + "plsz_5.png",
				"6": PathGameTongyong.ui_tongyong_general + "plsz_6.png",
				"7": PathGameTongyong.ui_tongyong_general + "plsz_7.png",
				"8": PathGameTongyong.ui_tongyong_general + "plsz_8.png",
				"9": PathGameTongyong.ui_tongyong_general + "plsz_9.png",
			}
			this._gridEditor = new GridEditor(31.93, 31.7, 20, 6, textureTypes, false)
			this._gridEditor.x = 74;
			this._gridEditor.y = 191;
			this._viewUI.list_record.parent.addChild(this._gridEditor);
			this._game.sceneObjectMgr.on(LonghuMapInfo.EVENT_ROAD_RECORD, this, this.onUpdateRoadInfo);//大路记录变化
			this._game.sceneObjectMgr.on(LonghuMapInfo.EVENT_GAME_RECORD, this, this.onUpdateRecord);//游戏记录更新
			this.onUpdateRoadInfo();
			this.onUpdateRecord();
		}

		// 页面打开时执行函数
		protected onOpen(): void {
			super.onOpen();
			this._viewUI.list_record.itemRender = this.createChildren("game_ui.longhu.component.RecordRenderUI", MapRecordRender);
			this._viewUI.list_record.renderHandler = new Handler(this, this.renderHandler1);

			this._mapinfo = this._game.sceneObjectMgr.mapInfo as LonghuMapInfo;
			if (this._mapinfo) {
				this.onUpdateRoadInfo();
				this.onUpdateRecord();
			}
		}

		private renderHandler1(cell: MapRecordRender, index: number) {
			if (cell) {
				cell.setData(this._game, cell.dataSource);
			}
		}

		//最近游戏记录
		private onUpdateRecord(): void {
			if (!this._mapinfo) return;
			let recordArr = [];
			let gameRecord = this._mapinfo.GetGameRecord();
			if (gameRecord != "") {
				recordArr = JSON.parse(gameRecord);
			}
			this._viewUI.list_record.dataSource = recordArr;

			let gameNum = 20;//recordArr.length
			this._viewUI.txt_title.text = StringU.substitute("近{0}局胜负", gameNum);
			//计算最近20场胜负
			let longWin = 0;
			let huWin = 0;
			for (let i = 0; i < recordArr.length; i++) {
				if (recordArr[i] == 2)
					longWin++;
				if (recordArr[i] == 3)
					huWin++;
			}
			this._viewUI.txt_long.text = Math.round(longWin * 100 / gameNum) + "%";
			this._viewUI.txt_hu.text = Math.round(huWin * 100 / gameNum) + "%";
		}

		//大路
		private onUpdateRoadInfo(): void {
			if (!this._mapinfo) return;
			let recordArr = [];//战绩记录器
			let roadRecord = this._mapinfo.GetRoadRecord()
			if (roadRecord != "") {
				recordArr = JSON.parse(roadRecord);
			}
			let posArr = [];//坐标记录器
			let roadPos = this._mapinfo.GetRoadPos()
			if (roadPos != "") {
				posArr = JSON.parse(roadPos);
			}
			let arr = [];
			if (recordArr && recordArr.length) {
				for (let i = 0; i < recordArr.length; i++) {
					arr.push(posArr[i][0]);
					arr.push(posArr[i][1]);
					arr.push(recordArr[i]);
				}
			}
			this._gridEditor.setData(arr)
		}

		public close(): void {
			if (this._viewUI) {
				this._game.sceneObjectMgr.off(LonghuMapInfo.EVENT_ROAD_RECORD, this, this.onUpdateRoadInfo);//大路记录变化
				this._game.sceneObjectMgr.off(LonghuMapInfo.EVENT_GAME_RECORD, this, this.onUpdateRecord);//游戏记录更新
				if (this._gridEditor) {
					this._gridEditor.removeSelf();
					this._gridEditor.destroy();
					this._gridEditor = null;
				}
			}
			super.close();
		}
	}
	class MapRecordRender extends ui.nqp.game_ui.longhu.component.RecordRenderUI {
		private _game: Game;
		private _data: any;
		constructor() {
			super();
		}
		setData(game: Game, data: any) {
			this._game = game;
			this._data = data;
			if (this._data != 1 && this._data != 2 && this._data != 3) {
				this.visible = false;
				return;
			}
			this.visible = true;
			this.record.skin = StringU.substitute(Path_game_longhu.ui_longhu + "zs_{0}.png", this._data == 1 ? "2" : this._data == 2 ? "0" : "1");
		}
		destroy() {
			super.destroy();
		}
	}
}