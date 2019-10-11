/**
* name 
*/
module gamelonghu.data {
	export class LonghuData extends gamecomponent.object.PlayingPuKeCard {
		public _isFan: boolean = false;
		private _b: boolean;
		//牌X轴位置，牌Y轴位置
		private _posList: any = [[420, 160], [300, 270], [971, 270]];
		private _curIdx: number;
		private _size: number = 0.8;//牌尺寸

		constructor() {
			super();
		}

		public Init(v: number) {
			//8副牌
			if (v < 0 || v > 52 * 8) {
				throw "PlayingCard v < 0 || v > 52 * 8," + v
			}
			this._val = v - 1;
			this.Analyze();
			this.time_interval = 400;
		}

		protected Analyze(): void {
			let val = this._val % 52;
			this._card_val = val % 13 + 1;
			this._card_color = Math.floor(val / 13);
			this._isFan = this._val < 0 ? false : true;
		}

		myOwner(index: number) {
			this.size = 0.2;
			this._curIdx = index;
			this.rotateAngle = Math.PI / 6;
		}

		fapai() {
			let posX = this._posList[this._curIdx][0];
			let posY = this._posList[this._curIdx][1];
			if (!this.targe_pos) {
				this.targe_pos = new Vector2();
			}
			this.targe_pos.x = posX;
			this.targe_pos.y = posY;
			this.scaleX = -1;
			super.fapai();
			Laya.Tween.to(this, { size: this._curIdx == 0 ? 0.2 : this._size }, this.time_interval);
			Laya.Tween.to(this, { rotateAngle: Math.PI * 4 }, this.time_interval);
		}

		refapai() {
			let posX = this._posList[this._curIdx][0];
			let posY = this._posList[this._curIdx][1];
			if (!this.targe_pos) {
				this.targe_pos = new Vector2();
			}
			this.pos.x = posX;
			this.pos.y = posY;
			this.targe_pos.x = posX;
			this.targe_pos.y = posY;
			this.scaleX = -1;
			this.size = this._curIdx == 0 ? 0.2 : this._size;
			this.rotateAngle = Math.PI * 4;
			super.fapai();
		}

		fanpai() {
			if (!this._isFan) return;
			super.fanpai();
		}

		kaipai() {
			if (!this._isFan) return;
			this.scaleX = 1;
			this.isShow = true;
		}
	}
}