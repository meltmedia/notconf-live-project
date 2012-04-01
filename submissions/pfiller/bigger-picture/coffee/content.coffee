get_resize_dimensions = (w,h,tw,th) ->
  if tw > w or th > h
    scale = if tw/w < th/h then tw/w else th/h
    {
      w: Math.floor(w * scale)
      h: Math.floor(h * scale)
    }
  else
    {w: w, h: h}

class slide
  
  pending_show: null
  loaded: false
  
  lw: -1
  lh: -1
  
  constructor: (@src, @caption, @id) ->
    @create_image()
  
  create_image: ->
    @img = new Image()
    @img.onload = (evt) => @image_loaded()
    @img.src = @src
  
  image_loaded: ->
    @loaded = true
    
    @width = @img.width
    @height = @img.height
    
    @show_slide(@pending_show.h, @pending_show.w) if @pending_show
  
  show_slide: (h, w) ->
    if not @loaded
      @pending_show = { h: h, w: w }
    else
      if not @element or @lh isnt h or @lw isnt w
        @build_element(h, w)
      @element.fadeIn("fast")
  
  hide_slide: () ->
    @element.fadeOut("fast")
  
  build_element: (h, w) ->
    @element = $("##{@id}") if not @element
    @lh = h
    @lw = w
    new_wh = get_resize_dimensions(@width, @height, @lw, @lh)
    @img = $("<img />", {src: @src, width: new_wh.w, height: new_wh.h})
    @element.html(@img)

class slideshow
  
  slides: []
  current_index: 0
  ul: $("<ul />", { id: "slideshow" })
  
  constructor: (images) -> 
    @set_up_image(image) for image in images
    $("body").append(@ul)
    @set_up_listeners()
    @show_current()
    
  set_up_image: (image) ->
    image = $(image)
    src = image.find(".bpImage").first().prop("src")
    caption = image.find(".bpCaption")

    caption.find(".photoNum").remove()
    caption.find(".cf, a").remove()
    caption = caption.text()

    id = "slide-#{@slides.length}"
    @ul.append($("<li >",{id: id}))
    @slides.push new slide( src, caption, id )

  show_current: () ->
    @slides[@current_index].show_slide( $(window).height(), $(window).width())
  
  hide_current: () ->
    @slides[@current_index].hide_slide()
  
  set_up_listeners: () ->
    $("body").on("keydown", (evt) => @test_keypress(evt))
  
  test_keypress: (evt) ->
    kc = evt.keyCode
    to = -9999
    if(kc in [39, 40])
      to = if @current_index < @slides.length - 1 then @current_index + 1 else 0
    else if(kc in [37, 38])
      to = if @current_index > 0 then @current_index - 1 else @slides.length - 1
    
    if to >= 0
      evt.preventDefault()
      @hide_current()
      @current_index = to
      @show_current()


images = $(".bpImageTop, .bpBoth")
$("body").html("")
ss = new slideshow(images)