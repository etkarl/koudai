(function($){
	$.namespace('Energon.ui.BothwayChooser');
	Energon.ui.BothwayChooser = function(options){
		this.init(options);
	};
	Energon.ui.BothwayChooser.prototype = {
		defaultOptions : {
			container : null,
			change : function(){

			},
			max : 0
		},
		init : function(options){
			var that = this;
			that.options = {};
			$.extend(that.options,that.defaultOptions,options);
			that.container = that.options.container;
			if(!that.container){
				return;
			}

			that.isSearchMode = false;
			that.isCtrlDown = false;
			that.isShiftDown = false;
			that.previousNodesQueue = {
				source : [],
				search : [],
				direction : []
			}

			that.pageBody = $(document.body);
			that.sourceContainer = that.container.find('.source .total-list');
			that.searchContainer = that.container.find('.source .search-result');
			that.directionContainer = that.container.find('.direction>.list-wrap>ul');
			that.searchBox = that.container.find('.search-box>input');
			that.searchBtn = that.container.find('.search-box>a');
			that.allGoBtn = that.container.find('.operation [data-type="allGo"]');
			that.goBtn = that.container.find('.operation [data-type="go"]');
			that.backBtn = that.container.find('.operation [data-type="back"]');
			that.allBackBtn = that.container.find('.operation [data-type="allBack"]');
			that.countCenter = that.container.find('.count-center');
			that.initResourcePool();
			that.bindEvents();
			that.manageOperationBtns();
			that.count();
		},
		initResourcePool : function(){
			var that = this;
			that.sourcePool = that.getResource(that.sourceContainer);
			that.directionPool = that.getResource(that.directionContainer);
		},
		getResource : function(el){
			var that = this,
			pool = el.data('pool');
			if(pool){
				return pool;
			}
			return that.scan(el.children());
		},
		scan : function(nodeList){
			var that = this,
			pool = [],
			node;
			for(var i=0,l=nodeList.length;i<l;i++){
				node = nodeList.eq(i);
				pool.push(that.turnElementToObject(node));
			}
			return pool;
		},
		turnElementToObject : function(node){
			var item = {};
			item.id = node.data('id');
			item.index = node.data('index');
			item.name = node.html();
			return item;
		},
		bindEvents : function(){
			var that = this;
			that.pageBody.on('keydown',function(e){
				if(e.keyCode === 17 || e.keyCode === 91 || e.keyCode === 93){
					that.isCtrlDown = true;
				}
				if(e.keyCode === 16){
					that.isShiftDown = true;
				}
			});
			that.pageBody.on('keyup',function(e){
				if(e.keyCode === 17 || e.keyCode === 91 || e.keyCode === 93){
					that.isCtrlDown = false;
				}
				if(e.keyCode === 16){
					that.isShiftDown = false;
				}
			});
			that.searchBox.on('keyup',function(e){
				var el = $(this),
				keyword = $.trim(el.val()),
				bool = (keyword!=='');
				if(e.keyCode === 13){
					if(keyword){
						that.search(keyword);
					}
					that.switchMode(keyword);
				}
			});
			that.searchBtn.on('click',function(e){
				e.preventDefault();
				var keyword = $.trim(that.searchBox.val()),
				bool = (keyword!=='');
				if(keyword){
					that.search(keyword);
				}
				that.switchMode(bool);
			});
			that.container.delegate('.list-wrap li[data-id]','click',function(e){
				var el = $(this),
				type = el.parent().data('type');
				that.selectNodes(el,type);
				that.manageOperationBtns();
			});
			that.container.delegate('.operation a','click',function(e){
				e.preventDefault();
				var el = $(this),
				type = el.data('type'),
				isForbid = el.hasClass('forbid');
				if(isForbid){
					return;
				}
				switch(type){
					case 'allGo':{
						that.go(that.isSearchMode?that.searchContainer.children():that.sourceContainer.children());
						break;
					}
					case 'go':{
						that.go();
						break;
					}
					case 'back':{
						that.back();
						break;
					}
					case 'allBack':{
						that.back(that.directionContainer.children());
						break;
					}
				}
				that.clearPreviousNodesQueue();
				that.manageOperationBtns();
				that.count();
				that.options.change.call(null,that.directionPool);
			});
		},
		clearPreviousNodesQueue : function(){
			var that = this;
			for(var i in that.previousNodesQueue){
				that.previousNodesQueue[i].length = 0;
			}
		},
		selectNodes : function(el,type){
			var that = this,
			isSelected = el.hasClass('selected'),
			previousNodes = that.previousNodesQueue[type];
			if(that.isCtrlDown){
				if(isSelected){
					el.removeClass('selected');
					that.filterUnselectNode(el,previousNodes);
				}
				else{
					el.addClass('selected');
					previousNodes.push(el);
				}
			}
			else{
				if(that.isShiftDown){
					if(previousNodes.length === 0){
						el.addClass('selected');
						previousNodes.push(el);
					}
					else{
						that.selectNodeSection(el,previousNodes);
					}
				}
				else{
					that.cancelSelectNodes(previousNodes);
					if(previousNodes.length>1){
						el.addClass('selected');
						previousNodes[0] = el;
						previousNodes.length = 1;
					}
					else{
						if(isSelected){
							previousNodes.length = 0;
						}
						else{
							el.addClass('selected');
							previousNodes[0] = el;
							previousNodes.length = 1;
						}
					}
				}
			}
		},
		cancelSelectNodes : function(previousNodes){
			var that = this,
			node;
			for(var i=0,l=previousNodes.length;i<l;i++){
				node = previousNodes[i];
				node.removeClass('selected');
			}
		},
		filterUnselectNode : function(el,previousNodes){
			var that = this,
			id = el.data('id'),
			node;
			for(var i=0,l=previousNodes.length;i<l;i++){
				node = previousNodes[i];
				if(node.data('id') == id){
					previousNodes.splice(i,1);
					break;
				}
			}
		},
		selectNodeSection : function(el,previousNodes){
			var that = this,
			thePreviousNode = previousNodes[previousNodes.length-1],
			index = el.data('index'),
			previousIndex = thePreviousNode.data('index'),
			sectionNodes,
			node;
			that.cancelSelectNodes(previousNodes);
			previousNodes.length = 0;
			if(index<previousIndex){
				sectionNodes = el.nextUntil('[data-index="'+previousIndex+'"]');
			}
			else{
				sectionNodes = el.prevUntil('[data-index="'+previousIndex+'"]');
			}
			thePreviousNode.addClass('selected');
			previousNodes.push(thePreviousNode);
			for(var i=0,l=sectionNodes.length;i<l;i++){
				node = sectionNodes.eq(i);
				node.addClass('selected');
				previousNodes.push(node);
			}
			el.addClass('selected');
			previousNodes.push(el);
		},
		manageOperationBtns : function(){
			var that = this;
			if(that.directionPool.length===0){
				that.allBackBtn.addClass('forbid');
				that.backBtn.addClass('forbid');
			}else{
				that.allBackBtn.removeClass('forbid');
				if(that.previousNodesQueue.direction.length === 0){
					that.backBtn.addClass('forbid');
				}
				else{
					that.backBtn.removeClass('forbid');
				}
			}
			if(that.isSearchMode){
				if(that.searchContainer.children('[data-id]').length===0){
					that.allGoBtn.addClass('forbid');
					that.goBtn.addClass('forbid');
				}
				else{
					that.allGoBtn.removeClass('forbid');
					if(that.previousNodesQueue.search.length === 0){
						that.goBtn.addClass('forbid');
					}
					else{
						that.goBtn.removeClass('forbid');
					}
				}
			}
			else{
				if(that.sourcePool.length===0){
					that.allGoBtn.addClass('forbid');
					that.goBtn.addClass('forbid');
				}
				else{
					that.allGoBtn.removeClass('forbid');
					if(that.previousNodesQueue.source.length === 0){
						that.goBtn.addClass('forbid');
					}
					else{
						that.goBtn.removeClass('forbid');
					}
				}
			}
		},
		buildList : function(a){
			var that = this,
			html = '';
			for(var i=0,l=a.length;i<l;i++){
				html += that.buildItem(a[i]);
			}
			return html;
		},
		buildItem : function(o){
			var id = o.id,
			name = o.name,
			index = o.index,
			html = '';
			html += '<li data-id="';
			html += id;
			html += '" data-index="';
			html += index;
			html += '">';
			html += name;
			html += '</li>';
			return html;
		},
		switchMode : function(bool){
			var that = this;
			if(bool){
				that.sourceContainer.hide();
				that.searchContainer.show();
			}
			else{
				that.sourceContainer.show();
				that.searchContainer.hide();
			}
			that.isSearchMode = !!bool;
			that.manageOperationBtns();
		},
		search : function(keyword){
			var that = this,
			item,
			name,
			html = '';
			for(var i=0,l=that.sourcePool.length;i<l;i++){
				item = that.sourcePool[i];
				name = item.name;
				if(name.match(keyword)!==null){
					html += that.buildItem(item);
				}
			}
			if(html === ''){
				html = '<li class="no-search-result">未找到结果，请尝试其他关键字</li>';
			}
			that.searchContainer.html(html);
			that.previousNodesQueue.search.length = 0;
		},
		removeItemsFormPool : function(ids, pool){
			var item,
			isMatch = false;
			for(var i=0;i<pool.length;){
				item = pool[i];
				isMatch = false;
				if(ids.length===0){
					break;
				}
				for(var j=0;j<ids.length;){
					if(item.id === ids[j]){
						ids.splice(j,1);
						isMatch = true;
						break;
					}
					else{
						j++;
					}
				}
				if(isMatch === true){
					pool.splice(i,1);
				}
				else{
					i++;
				}
			}
		},
		setItemsToPool : function(items, pool){
			$.merge(pool,items);
			pool.sort(function(a,b){
				return a.index-b.index;
			});
		},
		leave : function(el,pool,els){
			var that = this,
			selectedEls = el.find('.selected'),
			node,
			ids = [],
			items = [];
			if(els){
				for(var j=0,l=els.length;j<l;j++){
					node = els.eq(j);
					items.push(that.turnElementToObject(node));
				}
				if(pool){
					pool.length = 0;
				}
				els.remove();
				return items;
			}
			for(var i=0,l=selectedEls.length;i<l;i++){
				node = selectedEls.eq(i);
				ids.push(node.data('id'));
				items.push(that.turnElementToObject(node));
			}
			if(pool){
				that.removeItemsFormPool(ids,pool);
			}
			selectedEls.remove();
			return items;
		},
		insert : function(el,items,pool){
			var that = this,
			nodes = el.children(),
			node,
			item,
			index,
			newEl,
			html = '';
			if(pool){
				that.setItemsToPool(items, pool);
			}
			if(nodes.length === 0){
				for(var k=0,len=items.length;k<len;k++){
					html += that.buildItem(items[k]);
				}
				el.html(html);
				return;
			}
			for(var i=0,l=items.length;i<l;i++){
				item = items[i];
				index = item.index;
				newEl = $(that.buildItem(items[i]));
				for(var j=0;j<nodes.length;j++){
					node = nodes.eq(j);
					if(index<node.data('index')){
						newEl.insertBefore(node);
						nodes = el.children();
						break;
					}
					else{
						if(j===nodes.length-1){
							newEl.insertAfter(node);
						}
					}
				}
			}
		},
		go : function(els){
			var that = this,
			items,
			id,
			ids = [];
			if(that.isSearchMode){
				items = that.leave(that.searchContainer,null,els);
				for(var i=0,l=items.length;i<l;i++){
					id = items[i].id;
					ids.push(id);
					that.container.find('.source .total-list li[data-id="'+id+'"]').remove();
				}
				that.removeItemsFormPool(ids,that.sourcePool);
			}
			else{
				items = that.leave(that.sourceContainer,that.sourcePool,els);
			}
			that.insert(that.directionContainer,items,that.directionPool);
		},
		back : function(els){
			var that = this,
			items;
			items = that.leave(that.directionContainer,that.directionPool,els);
			that.insert(that.sourceContainer,items,that.sourcePool);
			if(that.isSearchMode){
				that.searchBtn.trigger('click');
			}
		},
		count : function(){
			var that = this,
			n = that.directionPool.length,
			html = '(';
			if(that.options.max){
				html += n+'/'+that.options.max;
				if(n>that.options.max){
					that.countCenter.addClass('result-full');
				}
				else{
					that.countCenter.removeClass('result-full');
				}
			}
			else{
				html += n;
			}
			html += ')';
			that.countCenter.html(html);
		}
	};
})(jQuery);