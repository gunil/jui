jui.define("uix.tab", [ "util", "ui.dropdown" ], function(_, dropdown) {
	
	/**
	 * UI Class
	 * 
	 */
	var UI = function() {
		var ui_menu = null,
			$anchor = null;
			
		var menuIndex = -1, // menu index
			activeIndex = 0;
		
			
		/**
		 * Private Methods
		 * 
		 */
		
		function hideAll(self) {
			var $list = $(self.root).children("li");
			$list.removeClass("active");
		}
		
		function showMenu(self, elem) {
			var pos = $(elem).offset();
			
			$(elem).parent().addClass("menu-keep");
			ui_menu.show(pos.left, pos.top + $(self.root).height());
		}
		
		function hideMenu(self) {
			var $list = $(self.root).children("li"),
				$menuTab = $list.eq(menuIndex);
			
			$menuTab.removeClass("menu-keep");
		}
		
		function changeTab(self, index) {
			hideAll(self);
			
			var $list = $(self.root).children("li"),
				$tab = $list.eq(index).addClass("active");
			
			$anchor.appendTo($tab);
			showTarget(self.options.target, $tab[0]);
		}
		
		function setEventNodes(self) {
			var $list = $(self.root).children("li");
			
			// 해당 인덱스가 리스트보다 클 경우
			if(self.options.index > $list.size() - 1) {
				self.options.index = 0;
			}
			
			$list.each(function(i) {
				// 인덱스 설정
				if($(this).attr("class") == "active" || self.options.index == i) { 
					var tmpObj = this;
					
					setTimeout(function() { // 최초에 숨겨진 컨텐츠 영역 처리
						$anchor.appendTo($(tmpObj));
						activeIndex = i;
						
						changeTab(self, i);
					}, 10);
				}
				
				// 메뉴 설정
				if($(this).hasClass("menu")) {
					menuIndex = i;
				}
			
				// 이벤트 설정
				self.addEvent($(this), "click", "a", function(e) {
					var text = $(e.currentTarget).text();
					
					if(i != menuIndex) {
						if(self.options.target != "") 
							showTarget(self.options.target, this);
						
						self.emit("change", [ { index: i, text: text }, e ]);
						changeTab(self, i);
						
						activeIndex = i;
					} else {
						self.emit("menu", [ { index: i, text: text }, e ]);
						if(ui_menu.type != "show") showMenu(self, this);
					}
					
					e.preventDefault();
				});
			});
		}
		
		function showTarget(target, elem, isInit) {
			var hash = $(elem).find("[href*=\#]").attr("href");
			
			$(target).children("*").each(function(i) {
				var self = this;
				
				if(("#" + self.id) == hash) {
					$(self).show();
				} else {
					$(self).hide();
				}
			});
		}
		
		
		/**
		 * Public Methods & Options
		 * 
		 */
		this.setting = function() {
			return {
				options: {
					target: "", 
					index: 0,
					nodes: []
				},
				valid: {
					update: [ "array" ],
					insert: [ "integer", "object" ],
					append: [ "object" ],
					prepend: [ "object" ],
					remove: [ "integer" ],
					show: [ "integer" ]
				}
			}
		}
		
		this.init = function() {
			var self = this, opts = this.options;
			
			// 컴포넌트 요소 세팅
			$anchor = $("<div class='anchor'></div>");
			
			// 탭 목록 갱신 및 이벤트 설정
			if(opts.nodes.length > 0) {
				this.update(opts.nodes);
			} else {
				setEventNodes(this);
			}
			
			// 드롭다운 메뉴 
			if(this.tpl.menu) {
				var $menu = $(this.tpl.menu());
				$menu.insertAfter($(self.root));
				
				ui_menu = dropdown($menu, {
					event: {
						change: function(data, e) {
							hideMenu(self);
							self.emit("changeMenu", [ data, e ]);
						},
						hide: function() {
							hideMenu(self);
						}
					}
				});
			}
			
			return this;
		}
		
		this.update = function(nodes) {
			if(!this.tpl.node) return;
			
			$(this.root).empty();
			
			for(var i = 0; i < nodes.length; i++) {
				$(this.root).append(this.tpl.node(nodes[i]));
			}

			setEventNodes(this);
		}
		
		this.insert = function(index, node) {
			if(!this.tpl.node) return;
			
			var html = this.tpl.node(node),
				$list = $(this.root).children("li");
			
			if(index == $list.size()) {
				$(html).insertAfter($list.eq(index - 1));
			} else {
				$(html).insertBefore($list.eq(index));
			}

			setEventNodes(this);
		}
		
		this.append = function(node) {
			if(!this.tpl.node) return;

			var html = this.tpl.node(node);
			
			if(menuIndex != -1) {
				$(html).insertBefore($(this.root).find(".menu"));
				menuIndex++;
			} else {
				$(this.root).append(html);
			}
			
			setEventNodes(this);
		}
		
		this.prepend = function(node) {
			if(!this.tpl.node) return;

			$(this.root).prepend(this.tpl.node(node));
			setEventNodes(this);
		}
		
		this.remove = function(index) {
			$(this.root).children("li").eq(index).remove();
			setEventNodes(this);
		}
		
		this.move = function(index, targetIndex) {
			if(index == targetIndex) return;
			
			var $tabs = $(this.root).children("li");
			
			if(targetIndex == $tabs.size() - 1) {
				$tabs.eq(index).insertAfter($tabs.eq(targetIndex));
			} else {
				$tabs.eq(index).insertBefore($tabs.eq(targetIndex + 1));
			}
			
			setEventNodes(this);
		}
		
		this.show = function(index) {
			changeTab(this, index);
			this.emit("show", [ index ]);
		}
		
		this.activeIndex = function() {
			return activeIndex;
		}
	}
	
	return UI;
});