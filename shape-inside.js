var ctx;

function shapeinside(element, shape, options){
    var sheight = 16;
    var currentelement = document.getElementById(element);
    var myshape = shape.replace('polygon(', '');
    myshape = myshape.replace(')', '');
    myshape = myshape.split(' ');
    var arshape = [];
    var ts = '';
    for (si in myshape){
        ts = myshape[si].split(',');
        arshape.push([parseInt(ts[0]), parseInt(ts[1])]);
    }
    var shapetext = currentelement.innerHTML;
    shapetext = shapetext.split(' ');
    var mywidth = currentelement.offsetWidth;
    var myheight = currentelement.offsetHeight;
    currentelement.innerHTML = '<canvas id="shape-inside-canvas" width="'+mywidth+'" height="'+myheight+'"></canvas>';
    var c=document.getElementById("shape-inside-canvas");
    ctx=c.getContext("2d");
    drawshape(arshape);
    var fpy = getfpy(arshape);
    var pshapetext = [];
    while (shapetext.length){
      var fp = getfirstpoint(arshape, sheight, fpy);
      var lp = getlastpoint(arshape, sheight, fpy);
      console.log([fp, lp]);
      if (isNaN(fp[0])){
        fp[0] = 0;
      }
      if (isNaN(lp[0])){
        lp[0] = mywidth;
      }
      pshapetext = shapetext;
      shapetext = drawline(fp, lp, sheight, arshape, shapetext);
      fpy = fpy+sheight;
    }
}

function drawshape(arshape){
    var first = true;
    for (ari in arshape){
        if (first){
            ctx.moveTo(arshape[ari][0],arshape[ari][1]);
            first = false;
        }
        else {
            ctx.lineTo(arshape[ari][0],arshape[ari][1]);
            ctx.stroke();
        }
    }
}

function getfirstpoint(arshape, sheight, fpy){
    var fpxar = [];
    //get ~ width
    var minwx = 999999999;
    var maxwx = 0;
    for (ari in arshape){
        if (arshape[ari][0]<minwx){
            minwx = arshape[ari][0];
        }
        if (arshape[ari][0]>maxwx){
            maxwx = arshape[ari][0];
        }
    }
    var awidth = maxwx-minwx;
    var maxfx = 0;
    var cflag = false;
    //get points between top of string and bot of string
    for (ari in arshape){
        if (arshape[ari][1]>=fpy && arshape[ari][1]<=(fpy+sheight) && arshape[ari][0]<(awidth/2 + minwx) && arshape[ari][0]>maxfx){
            maxfx = arshape[ari][0];
            cflag = true;
        }
    }
    if (!cflag){
        var mintp = [];
        var minbp = [];
        var cc = 999999999;
        var lx = 0;
        for (ari in arshape){
            if (ari==(arshape.length-1)){
                break;
            }
            // point ari -> ari+1 line cross y=fpy
            lx = (arshape[ari][0]*arshape[parseInt(ari)+1][1]-arshape[parseInt(ari)+1][0]*arshape[ari][1]-(arshape[ari][0]-arshape[parseInt(ari)+1][0])*fpy)/(arshape[parseInt(ari)+1][1]-arshape[ari][1]);
            // is lx between ari and ari+1, is fpy between ari and ari+1, is lx min
            if (((arshape[ari][1]-fpy)*(arshape[parseInt(ari)+1][1]-fpy))<0 && ((arshape[ari][0]-lx)*(arshape[parseInt(ari)+1][0]-lx))<0 && lx<cc){
                if (arshape[ari][1]>arshape[parseInt(ari)+1][1]){
                    mintp = arshape[ari];
                    minbp = arshape[parseInt(ari)+1];
                }
                else {
                    mintp = arshape[parseInt(ari)+1];
                    minbp = arshape[ari];
                }
                cc = lx;
            }
        }
        //get maxfx from line formula
        var maxfx1 = (minbp[0]*mintp[1]-mintp[0]*minbp[1]-(minbp[0]-mintp[0])*fpy)/(mintp[1]-minbp[1]);
        var maxfx2 = (minbp[0]*mintp[1]-mintp[0]*minbp[1]-(minbp[0]-mintp[0])*(fpy+sheight))/(mintp[1]-minbp[1]);
        if (maxfx1>maxfx2){
            maxfx = maxfx1;
        }
        else {
            maxfx = maxfx2;
        }
    }
    maxfx = Math.ceil(maxfx);
    return [maxfx, fpy];
}

function getlastpoint(arshape, sheight, fpy){
    var fpxar = [];
    //get ~ width
    var minwx = 999999999;
    var maxwx = 0;
    for (ari in arshape){
        if (arshape[ari][0]<minwx){
            minwx = arshape[ari][0];
        }
        if (arshape[ari][0]>maxwx){
            maxwx = arshape[ari][0];
        }
    }
    var awidth = maxwx-minwx;
    var maxfx = 999999999;
    var cflag = false;
    //get points between top of string and bot of string
    for (ari in arshape){
        if (arshape[ari][1]>=fpy && arshape[ari][1]<=(fpy+sheight) && arshape[ari][0]>(awidth/2 + minwx) && arshape[ari][0]<maxfx){
            maxfx = arshape[ari][0];
            cflag = true;
        }
    }
    if (!cflag){
        var mintp = [];
        var minbp = [];
        var lx = 0;
        var cc = 0;
        for (ari in arshape){
             if (ari==(arshape.length-1)){
                break;
            }
            // point ari -> ari+1 line cross y=fpy
            lx = (arshape[ari][0]*arshape[parseInt(ari)+1][1]-arshape[parseInt(ari)+1][0]*arshape[ari][1]-(arshape[ari][0]-arshape[parseInt(ari)+1][0])*fpy)/(arshape[parseInt(ari)+1][1]-arshape[ari][1]);
            // is lx between ari and ari+1, is fpy between ari and ari+1, is lx max
            if (((arshape[ari][1]-fpy)*(arshape[parseInt(ari)+1][1]-fpy))<0 && ((arshape[ari][0]-lx)*(arshape[parseInt(ari)+1][0]-lx))<0 && lx>cc){
                if (arshape[ari][1]>arshape[parseInt(ari)+1][1]){
                    mintp = arshape[ari];
                    minbp = arshape[parseInt(ari)+1];
                }
                else {
                    mintp = arshape[parseInt(ari)+1];
                    minbp = arshape[ari];
                }
                cc = lx;
            }
        }
        //get maxfx from line formula
        var maxfx1 = (minbp[0]*mintp[1]-mintp[0]*minbp[1]-(minbp[0]-mintp[0])*fpy)/(mintp[1]-minbp[1]);
        var maxfx2 = (minbp[0]*mintp[1]-mintp[0]*minbp[1]-(minbp[0]-mintp[0])*(fpy+sheight))/(mintp[1]-minbp[1]);
        if (maxfx1<maxfx2){
            maxfx = maxfx2;
        }
        else {
            maxfx = maxfx1;
        }
    }
    maxfx = Math.ceil(maxfx);
    return [maxfx, fpy];
}

function drawline(fp, lp, sheight, arshape, shapetext){
    var countWords = shapetext.length;
    var line = "";
    var counter = 0;
    for (var n = 0; n < countWords; n++) {
        ctx.font = 'normal '+sheight+'px Tahoma';
        var testLine = line + shapetext[n] + " ";
        var testWidth = ctx.measureText(testLine).width;
        if (testWidth>(lp[0]-fp[0]) || /\r|\n/.exec(line)){
            ctx.fillText(line, fp[0], fp[1]+sheight);
            counter = n;
            break;
        }
        else {
            line = testLine;
        }
        if (n==(countWords-1)){
            ctx.fillText(line, fp[0], fp[1]+sheight);
            counter = n+1;
        }
    }
    return shapetext.slice(counter);
}

function getfpy(arshape){
    //get ~ height
    var minwy = 999999999;
    var maxwy = 0;
    for (ari in arshape){
        if (arshape[ari][1]<minwy){
            minwy = arshape[ari][1];
        }
        if (arshape[ari][1]>maxwy){
            maxwy = arshape[ari][1];
        }
    }
    var aheight = maxwy-minwy;
    var fpm=0;
    for (ari in arshape){
        if (ari==0){
            if (arshape[ari][1]>arshape[parseInt(ari)+1][1] && arshape[ari][1]>arshape[parseInt(arshape.length)-1][1] && arshape[ari][1]>fpm && arshape[ari][1]<(aheight/2+minwy)){
                fpm = arshape[ari][1];
            }
        }
        else if (ari==(parseInt(arshape.length)-1)){
            if (arshape[ari][1]>arshape[parseInt(ari)-1][1] && arshape[ari][1]>arshape[0][1] && arshape[ari][1]>fpm && arshape[ari][1]<(aheight/2+minwy)){
                fpm = arshape[ari][1];
            }
        }
        else if (arshape[ari][1]>arshape[parseInt(ari)+1][1] && arshape[ari][1]>arshape[parseInt(ari)-1][1] && arshape[ari][1]>fpm && arshape[ari][1]<(aheight/2+minwy)){
            fpm = arshape[ari][1];
        }
    }
    if (fpm == 0){
        fpm = minwy;
    }
    return fpm+1;
}
