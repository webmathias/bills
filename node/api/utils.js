/**
 * Created by mathias on 6/22/17.
 */
module.exports = {
  toTable: function (result) {
    var lines = [];
    var _row = {};
    var _col = {};
    var _table = {};
    var _total = {};
    result.forEach(function (v, k) {
      //console.log(v)
      _row[v['_id'][0]] = 1;
      _col[v['_id'][1]] = 1;
      _table[v['_id'][0]] = _table[v['_id'][0]] || {};
      _table[v['_id'][0]][v['_id'][1]] = v['value']
    });
    var line = [''];
    Object.keys(_col).forEach(function (c) {
      // line += '\t' + c;
      line.push(c);
      _total[c] = 0;
    })
    line.push('Total');
    lines.push(line);
    // console.log(line + '\tTotal')
    Object.keys(_row).forEach(function (r) {
      var line = [];
      line.push(r)
      var soma = 0;
      Object.keys(_col).forEach(function (c) {
        // line += '\t' + (_table[r][c] || 0).toFixed(2);
        line.push((_table[r][c] || 0).toFixed(2))
        soma += (_table[r][c] || 0);
        _total[c] += (_table[r][c] || 0);
      })

      // console.log(line + '\t' + soma.toFixed(2));
      line.push(soma.toFixed(2));
      lines.push(line)
    })
    var line = ['Total:'];
    Object.keys(_col).forEach(function (c) {
      line.push(_total[c].toFixed(2));
    })
    lines.push(line);
    return lines;
  },
  load: function load(model, columns, value, start, end, query, callback) {
    // console.log(value);
    var o = {};
    o._field = value;
    o.scope = {
      value: value,
      columns: columns
    };
    o.map = function () {
      var obj = []
      for (var i = 0; i < columns.length; i++) {
        switch (columns[i]) {
          case 'date.year':
            obj[i] = this.date.getFullYear();
            break;
          case 'date.month':
            obj[i] = this.date.getFullYear() + '-' + (this.date.getMonth() + 1);
            break;
          case 'date.day':
            obj[i] = this.date.getFullYear() + '-' + (this.date.getMonth() + 1) + '-' + this.daysInMonth();
            break;

          default:
            obj[i] = this[columns[i]];
            break;
        }
      }
      emit(obj, this[value])
      // emit({mes:this.date.format('YYYY-mm'), categoria: this.category}, Math.min(0, this.value))
    }
    o.reduce = function (k, vals) {
      //var result = {key: k, values: vals};

      return Array.sum(vals);
    }
    if(query) {
      o.query = query;
      //{
        // confirmed: false
        // date: {"$gte": start, "$lt": end}
      //}
    }
    if (start) {
      o.query.date = o.query.date || {}
      o.query.date['$gte'] = start;
    }
    if (end) {
      o.query.date = o.query.date || {}
      o.query.date['$lt'] = end;
    }
    // console.log(o);
    model.mapReduce(o, callback);
  }
}
